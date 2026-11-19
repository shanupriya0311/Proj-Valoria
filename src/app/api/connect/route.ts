
import { NextResponse } from 'next/server';

const SALESFORCE_INSTANCE_URL =
  process.env.SALESFORCE_INSTANCE_URL?.trim().replace(/\/+$/, '');

const SALESFORCE_CONSUMER_KEY =
  process.env.SALESFORCE_CONSUMER_KEY?.trim();

const SALESFORCE_CONSUMER_SECRET =
  process.env.SALESFORCE_CONSUMER_SECRET?.trim();

type RequestBody = Record<string, unknown>;

type SalesforceTokenResponse = {
  access_token?: string;
  instance_url?: string;
  error?: string;
  error_description?: string;
};

let cachedToken: string | null = null;
let cachedInstanceUrl: string | null = null;
let tokenExpiresAt = 0;

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

// Get Salesforce OAuth access token
async function getSalesforceAccessToken(): Promise<{
  token: string;
  instanceUrl: string;
} | null> {
  if (
    cachedToken &&
    cachedInstanceUrl &&
    Date.now() < tokenExpiresAt
  ) {
    return {
      token: cachedToken,
      instanceUrl: cachedInstanceUrl,
    };
  }

  if (
    !SALESFORCE_INSTANCE_URL ||
    !SALESFORCE_CONSUMER_KEY ||
    !SALESFORCE_CONSUMER_SECRET
  ) {
    console.error('[Salesforce] Missing environment variables.');
    return null;
  }

  try {
    const tokenUrl =
      `${SALESFORCE_INSTANCE_URL}/services/oauth2/token`;

    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: SALESFORCE_CONSUMER_KEY,
      client_secret: SALESFORCE_CONSUMER_SECRET,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data =
      await response.json() as SalesforceTokenResponse;

    if (!response.ok || !data.access_token) {
      console.error('[Salesforce] Authentication failed:', {
        status: response.status,
        error: data.error,
        description: data.error_description,
      });

      return null;
    }

    cachedToken = data.access_token;
    cachedInstanceUrl =
      (data.instance_url || SALESFORCE_INSTANCE_URL).replace(/\/+$/, '');

    tokenExpiresAt = Date.now() + 50 * 60 * 1000;

    console.log('[Salesforce] Authentication successful.');

    return {
      token: cachedToken,
      instanceUrl: cachedInstanceUrl,
    };
  } catch (error) {
    console.error('[Salesforce] Token request failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });

    return null;
  }
}

export async function POST(request: Request) {
  // 1. Parse request
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

  // 2. Read form fields
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

  // 3. Validate fields
  if (
    fullName === null ||
    email === null ||
    phone === null ||
    jobTitle === null ||
    companyName === null ||
    companyWebsite === null ||
    companySize === null ||
    industry === null ||
    primaryInterest === null ||
    projectTimeline === null ||
    budgetRange === null ||
    projectScope === null ||
    existingTechStack === null ||
    preferredDeployment === null
  ) {
    return NextResponse.json(
      {
        success: false,
        message: 'One or more inquiry fields are invalid.',
      },
      { status: 400 }
    );
  }

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

  // 4. Authenticate with Salesforce
  const auth = await getSalesforceAccessToken();

  if (!auth) {
    return NextResponse.json(
      {
        success: false,
        message: 'Salesforce authentication failed. Please try again later.',
      },
      { status: 502 }
    );
  }

  // 5. Prepare Salesforce record
  const salesforcePayload = {
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
  };

  // 6. Create record using existing Apex REST endpoint
  try {
    const endpoint =
      `${auth.instanceUrl}/services/apexrest/valoria-inquiries/`;

    const sfResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salesforcePayload),
    });

    const responseText = await sfResponse.text();

    if (!sfResponse.ok) {
      console.error('[Salesforce] Record creation failed:', {
        status: sfResponse.status,
        response: responseText.slice(0, 1000),
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to save your inquiry in Salesforce.',
        },
        { status: 502 }
      );
    }

    let sfData: {
      inquiryNumber?: string;
      inquiryId?: string;
    } = {};

    try {
      sfData = JSON.parse(responseText);
    } catch {
      console.log('[Salesforce] Record created; no JSON response returned.');
    }

    console.log('[Salesforce] Inquiry record created successfully.');

    return NextResponse.json(
      {
        success: true,
        inquiryNumber: sfData.inquiryNumber || null,
        inquiryId: sfData.inquiryId || null,
        message: 'Your inquiry has been successfully submitted.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Salesforce] Record creation error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to connect to Salesforce. Please try again later.',
      },
      { status: 502 }
    );
  }
}
