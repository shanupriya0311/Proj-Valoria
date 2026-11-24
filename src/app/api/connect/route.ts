
import { NextResponse } from 'next/server';

const SALESFORCE_AUTH_URL =
  process.env.SALESFORCE_AUTH_URL?.replace(/\/+$/, '') ||
  'https://login.salesforce.com';

const SALESFORCE_API_PATH =
  '/services/apexrest/valoria-inquiries/';

// Cache Salesforce authentication within the Worker instance.
let cachedToken: string | null = null;
let cachedInstanceUrl: string | null = null;
let tokenExpiresAt = 0;

type RequestBody = Record<string, unknown>;

type SalesforceTokenResponse = {
  access_token?: string;
  instance_url?: string;
  error?: string;
  error_description?: string;
};

function isRequestBody(value: unknown): value is RequestBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readTextField(
  body: RequestBody,
  field: string,
  maxLength: number
): string | null {
  const value = body[field];

  if (value === undefined) return '';
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();

  return trimmed.length <= maxLength ? trimmed : null;
}

// --------------------------------------------------
// 1. Salesforce OAuth authentication
// --------------------------------------------------

async function getSalesforceAccessToken(): Promise<{
  token: string;
  instanceUrl: string;
} | null> {
  const now = Date.now();

  if (
    cachedToken &&
    cachedInstanceUrl &&
    now < tokenExpiresAt
  ) {
    return {
      token: cachedToken,
      instanceUrl: cachedInstanceUrl,
    };
  }

  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
  const refreshToken = process.env.SALESFORCE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error(
      '[Salesforce] OAuth environment variables are missing.'
    );
    return null;
  }

  try {
    const formData = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    });

    const response = await fetch(
      `${SALESFORCE_AUTH_URL}/services/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    const data =
      (await response.json()) as SalesforceTokenResponse;

    if (!response.ok || !data.access_token || !data.instance_url) {
      console.error('[Salesforce] OAuth authentication failed:', {
        status: response.status,
        error: data.error,
        description: data.error_description,
      });

      return null;
    }

    cachedToken = data.access_token;
    cachedInstanceUrl = data.instance_url.replace(/\/+$/, '');

    // Refresh before the token expires.
    tokenExpiresAt = Date.now() + 45 * 60 * 1000;

    console.log('[Salesforce] Authentication successful.');

    return {
      token: cachedToken,
      instanceUrl: cachedInstanceUrl,
    };
  } catch (error) {
    console.error('[Salesforce] Token request failed:', {
      message:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    });

    return null;
  }
}

// --------------------------------------------------
// 2. Send inquiry email using Resend HTTP API
// --------------------------------------------------

async function sendInquiryEmail(
  inquiryNumber: string,
  recipient: string,
  sender: string,
  apiKey: string,
  emailText: string,
  fullName: string,
  email: string
): Promise<boolean> {
  try {
    const response = await fetch(
      'https://api.resend.com/emails',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: sender,
          to: [recipient],
          reply_to: {
            name: fullName,
            email,
          },
          subject: `New Let's Connect inquiry (${inquiryNumber})`,
          text: emailText,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('[Connect API] Email delivery failed:', {
        status: response.status,
        error: result,
      });

      return false;
    }

    console.log('[Connect API] Inquiry email sent successfully.');

    return true;
  } catch (error) {
    console.error('[Connect API] Email request failed:', {
      message:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    });

    return false;
  }
}

// --------------------------------------------------
// 3. Main POST API
// --------------------------------------------------

export async function POST(request: Request) {
  try {
    // Parse request body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Please submit a valid inquiry.',
        },
        { status: 400 }
      );
    }

    if (!isRequestBody(body)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please submit a valid inquiry.',
        },
        { status: 400 }
      );
    }

    // Read form fields
    const fullName = readTextField(body, 'fullName', 200);
    const email = readTextField(body, 'email', 254);
    const phone = readTextField(body, 'phone', 100);
    const jobTitle = readTextField(body, 'jobTitle', 200);
    const companyName = readTextField(body, 'companyName', 200);
    const companyWebsite = readTextField(body, 'companyWebsite', 500);
    const companySize = readTextField(body, 'companySize', 100);
    const industry = readTextField(body, 'industry', 150);
    const primaryInterest = readTextField(body, 'primaryInterest', 200);
    const projectTimeline = readTextField(body, 'projectTimeline', 150);
    const budgetRange = readTextField(body, 'budgetRange', 150);
    const projectScope = readTextField(body, 'projectScope', 5000);
    const existingTechStack = readTextField(body, 'existingTechStack', 2000);
    const preferredDeployment = readTextField(body, 'preferredDeployment', 500);

    // Validate field types and lengths
    const fields = [
      fullName,
      email,
      phone,
      jobTitle,
      companyName,
      companyWebsite,
      companySize,
      industry,
      primaryInterest,
      projectTimeline,
      budgetRange,
      projectScope,
      existingTechStack,
      preferredDeployment,
    ];

    if (fields.some((field) => field === null)) {
      return NextResponse.json(
        {
          success: false,
          message: 'One or more inquiry fields are invalid.',
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !companyName ||
      !projectScope ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Please provide your name, a valid work email, company, and project scope.',
        },
        { status: 400 }
      );
    }

    // Generate inquiry number
    const inquiryNumber = `INQ-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    console.log('[Connect API] New inquiry received:', {
      inquiryNumber,
      companyName,
      email,
    });

    // Build email content
    const emailText = [
      'A new inquiry was submitted through the Valoria Technology website.',
      '',
      `Inquiry number: ${inquiryNumber}`,
      `Full name: ${fullName}`,
      `Work email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      `Job title: ${jobTitle || 'Not provided'}`,
      `Company: ${companyName}`,
      `Company website: ${companyWebsite || 'Not provided'}`,
      `Company size: ${companySize || 'Not provided'}`,
      `Primary industry: ${industry || 'Not provided'}`,
      `Core technology / engagement track: ${primaryInterest || 'Not provided'}`,
      `Target schedule: ${projectTimeline || 'Not provided'}`,
      `Investment scope: ${budgetRange || 'Not provided'}`,
      `Existing technologies: ${existingTechStack || 'Not provided'}`,
      `Preferred deployment: ${preferredDeployment || 'Not provided'}`,
      '',
      'Architecture and project scope:',
      projectScope,
    ].join('\n');

    // --------------------------------------------------
    // Send inquiry email
    // --------------------------------------------------

    const resendApiKey = process.env.RESEND_API_KEY;
    const inquiryRecipient = process.env.INQUIRY_RECIPIENT;
    const inquirySender = process.env.INQUIRY_FROM_EMAIL;

    if (!resendApiKey || !inquiryRecipient || !inquirySender) {
      console.error(
        '[Connect API] Email configuration is missing.'
      );

      return NextResponse.json(
        {
          success: false,
          message: 'Inquiry email is not configured yet.',
        },
        { status: 503 }
      );
    }

    const emailSent = await sendInquiryEmail(
      inquiryNumber,
      inquiryRecipient,
      inquirySender,
      resendApiKey,
      emailText,
      fullName,
      email
    );

    if (!emailSent) {
      return NextResponse.json(
        {
          success: false,
          message:
            'We could not send your inquiry right now. Please try again later.',
        },
        { status: 502 }
      );
    }

    // --------------------------------------------------
    // Register inquiry in Salesforce
    // --------------------------------------------------

    try {
      const auth = await getSalesforceAccessToken();

      if (auth) {
        const sfResponse = await fetch(
          `${auth.instanceUrl}${SALESFORCE_API_PATH}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${auth.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fullName,
              email,
              phone,
              jobTitle,
              companyName,
              companyWebsite,
              companySize,
              industry,
              primaryInterest,
              projectTimeline,
              budgetRange,
              projectScope,
              existingTechStack,
              preferredDeployment,
              source: 'Website - Lets Connect',
              inquiryNumber,
            }),
          }
        );

        if (!sfResponse.ok) {
          const responseText = await sfResponse.text();

          console.error('[Salesforce Bridge] Record creation failed:', {
            status: sfResponse.status,
            response: responseText.slice(0, 500),
          });
        } else {
          console.log(
            '[Salesforce Bridge] Inquiry registered successfully.'
          );
        }
      } else {
        console.warn(
          '[Salesforce Bridge] Salesforce authentication unavailable.'
        );
      }
    } catch (error) {
      console.error('[Salesforce Bridge] Registration failed:', {
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      });
    }

    // --------------------------------------------------
    // Successful response
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        inquiryNumber,
        message:
          'Your inquiry has been emailed to Valoria Technology.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Connect API] Unexpected server error:', {
      message:
        error instanceof Error
          ? error.message
          : 'Unknown server error',
    });

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error.',
      },
      { status: 500 }
    );
  }
}
