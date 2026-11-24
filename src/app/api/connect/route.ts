
import { NextResponse } from 'next/server';

const SALESFORCE_API_PATH = '/services/apexrest/valoria-inquiries/';

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getSalesforceAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const authUrl = process.env.SALESFORCE_AUTH_URL;
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;

  if (!authUrl || !clientId || !clientSecret) {
    throw new Error('Salesforce environment variables are missing.');
  }

  const response = await fetch(`${authUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    console.error('Salesforce authentication failed:', data);
    throw new Error('Salesforce authentication failed.');
  }

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (Number(data.expires_in || 3600) - 60) * 1000;

  return cachedToken;
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
    const formData = await request.json();

    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;

    if (!instanceUrl) {
      throw new Error('Salesforce instance URL is missing.');
    }

    const accessToken = await getSalesforceAccessToken();

    const salesforceResponse = await fetch(
      `${instanceUrl}${SALESFORCE_API_PATH}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        cache: 'no-store',
      }
    );

    const salesforceData = await salesforceResponse.json();

    console.log('Salesforce response:', salesforceData);

    if (!salesforceResponse.ok) {
  const errorDetails = {
    status: salesforceResponse.status,
    response: salesforceData,
  };

  console.error('Salesforce API Error:', errorDetails);

  return NextResponse.json(
    {
      success: false,
      message: 'Salesforce request failed.',
      error: salesforceData,
    },
    { status: 502 }
  );
}

    return NextResponse.json({
      success: true,
      message: 'Your inquiry was submitted successfully.',
      data: salesforceData,
    });
  } catch (error) {
    console.error('Connect API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to submit your inquiry. Please try again.',
      },
      { status: 500 }
    );
  }
}
