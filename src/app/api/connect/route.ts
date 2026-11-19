import { execSync } from 'child_process';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const SALESFORCE_INSTANCE_URL =
  'https://orgfarm-5c6f02648d-dev-ed.develop.my.salesforce.com';
let cachedSalesforceToken: string | null = null;
let salesforceTokenExpiresAt = 0;

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

function getSalesforceAccessToken(): string | null {
  const now = Date.now();
  if (cachedSalesforceToken && now < salesforceTokenExpiresAt) {
    return cachedSalesforceToken;
  }

  try {
    const raw = execSync(
      '/usr/local/bin/sf org auth show-access-token --target-org Valoria-Org --json',
      {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        env: {
          ...process.env,
          NO_COLOR: '1',
          FORCE_COLOR: '0',
          HOME: process.env.HOME || '/Users/varunshiyam',
          PATH: `${process.env.PATH || ''}:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin`,
        },
      }
    );

    const clean = raw.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '').trim();
    const jsonStart = clean.indexOf('{');
    const jsonEnd = clean.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const parsed = JSON.parse(clean.slice(jsonStart, jsonEnd + 1));
      const token = parsed?.result?.accessToken;
      if (token) {
        cachedSalesforceToken = token;
        salesforceTokenExpiresAt = now + 1000 * 60 * 25;
        return cachedSalesforceToken;
      }
    }
  } catch (error: unknown) {
    console.warn(
      '[Salesforce CLI Bridge] Could not get access token:',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }

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
      { success: false, message: 'Please provide your name, a valid work email, company, and project scope.' },
      { status: 400 }
    );
  }

  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');
  if (!gmailAppPassword) {
    console.error('[Connect API] GMAIL_APP_PASSWORD is not configured.');
    return NextResponse.json(
      { success: false, message: 'Inquiry email is not configured yet. Please try again later.' },
      { status: 503 }
    );
  }

  const inquiryNumber = `INQ-${Math.floor(10000 + Math.random() * 90000)}`;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: INQUIRY_RECIPIENT,
      pass: gmailAppPassword,
    },
  });

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

  try {
    await transporter.sendMail({
      from: `Valoria Technology <${INQUIRY_RECIPIENT}>`,
      to: INQUIRY_RECIPIENT,
      replyTo: { name: fullName, address: email },
      subject: `New Let's Connect inquiry (${inquiryNumber})`,
      text: emailText,
    });
  } catch (error: unknown) {
    console.error('[Connect API] Could not send inquiry email:', error);
    return NextResponse.json(
      { success: false, message: 'We could not send your inquiry right now. Please try again later.' },
      { status: 502 }
    );
  }

  try {
    const token = getSalesforceAccessToken();
    if (token) {
      const sfResponse = await fetch(
        `${SALESFORCE_INSTANCE_URL}/services/apexrest/valoria-inquiries/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
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
          }),
        }
      );

      if (!sfResponse.ok) {
        console.warn('[Salesforce Bridge] Non-OK response:', sfResponse.status);
      }
    }
  } catch (error: unknown) {
    console.warn('[Salesforce Bridge] Inquiry could not be registered:', error);
  }

  return NextResponse.json({
    success: true,
    inquiryNumber,
    message: 'Your inquiry has been emailed to Valoria Technology.',
  });
}
