import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const INQUIRY_RECIPIENT = 'valoriatechnology@gmail.com';
const SALESFORCE_INSTANCE_URL =
  process.env.SALESFORCE_INSTANCE_URL ||
  'https://orgfarm-5c6f02648d-dev-ed.develop.my.salesforce.com';
const SALESFORCE_CONSUMER_KEY =
  process.env.SALESFORCE_CONSUMER_KEY ||
  '3MVG9dAEux2v1sLsHuSS9FeaIYQaCbY1YyFM7_.P9U81Xzz_.lc_EG7x_mlTE5CvFNiFLasKRm7f2U9a5Emyb';
const SALESFORCE_CONSUMER_SECRET =
  process.env.SALESFORCE_CONSUMER_SECRET ||
  'C42DEFF028152ED154AAD943D235B98D089932A3E65000923C424D4E93A40D6B';

let cachedSalesforceToken: string | null = null;
let salesforceTokenExpiresAt = 0;

type RequestBody = Record<string, unknown>;

function isRequestBody(value: unknown): value is RequestBody {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readTextField(body: RequestBody, field: string, maxLength: number): string | null {
  const value = body[field];
  if (value === undefined) return '';
  if (typeof value !== 'string') return null;

  const trimmedValue = value.trim();
  return trimmedValue.length <= maxLength ? trimmedValue : null;
}

/**
 * Acquires a Salesforce OAuth 2.0 Bearer access token using External Client App
 * client_credentials flow. Tokens are cached in-memory for 50 minutes.
 */
async function getSalesforceAccessToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedSalesforceToken && now < salesforceTokenExpiresAt) {
    return cachedSalesforceToken;
  }

  if (!SALESFORCE_CONSUMER_KEY || !SALESFORCE_CONSUMER_SECRET) {
    console.warn('[Salesforce ECA] Missing Consumer Key or Secret.');
    return null;
  }

  try {
    const tokenUrl = `${SALESFORCE_INSTANCE_URL.replace(/\/+$/, '')}/services/oauth2/token`;
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
      cache: 'no-store',
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Salesforce ECA] Token exchange failed:', response.status, errText);
      return null;
    }

    const data = await response.json();
    if (data && data.access_token) {
      cachedSalesforceToken = data.access_token;
      // Salesforce tokens are valid for 1-2 hours; cache safely for 50 minutes
      salesforceTokenExpiresAt = now + 50 * 60 * 1000;
      return cachedSalesforceToken;
    }
  } catch (error: unknown) {
    console.error(
      '[Salesforce ECA] Error requesting access token:',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }

  return null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Please submit a valid inquiry.' },
      { status: 400 }
    );
  }

  if (!isRequestBody(body)) {
    return NextResponse.json(
      { success: false, message: 'Please submit a valid inquiry.' },
      { status: 400 }
    );
  }

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
      { success: false, message: 'One or more inquiry fields are invalid.' },
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
        message: 'Please provide your name, a valid work email, company, and project scope.',
      },
      { status: 400 }
    );
  }

  // 1. Submit inquiry directly to Salesforce via Apex REST service
  let officialInquiryNumber: string | null = null;
  let inquiryRecordId: string | null = null;

  try {
    const token = await getSalesforceAccessToken();
    if (token) {
      const sfEndpoint = `${SALESFORCE_INSTANCE_URL.replace(/\/+$/, '')}/services/apexrest/valoria-inquiries/`;
      const sfResponse = await fetch(sfEndpoint, {
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
      });

      if (sfResponse.ok) {
        const sfData = await sfResponse.json();
        if (sfData && sfData.inquiryNumber) {
          officialInquiryNumber = sfData.inquiryNumber;
          inquiryRecordId = sfData.inquiryId || null;
        }
      } else {
        const errBody = await sfResponse.text();
        console.warn('[Salesforce Bridge] Non-OK response from Apex REST:', sfResponse.status, errBody);
      }
    }
  } catch (error: unknown) {
    console.warn('[Salesforce Bridge] Inquiry could not be registered in Salesforce:', error);
  }

  const inquiryNumber =
    officialInquiryNumber || `INQ-${Math.floor(10000 + Math.random() * 90000)}`;

  // 2. Dispatch email notification via nodemailer if Gmail App Password is configured
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');
  if (gmailAppPassword) {
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
      `Inquiry ticket: ${inquiryNumber}`,
      ...(inquiryRecordId ? [`Salesforce record ID: ${inquiryRecordId}`] : []),
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
    } catch (mailError: unknown) {
      console.warn('[Connect API] Email dispatch error:', mailError);
    }
  }

  return NextResponse.json({
    success: true,
    inquiryNumber,
    inquiryId: inquiryRecordId,
    message: officialInquiryNumber
      ? `Your inquiry has been logged in Salesforce Enterprise Desk under ${officialInquiryNumber}.`
      : 'Your inquiry has been successfully submitted to Valoria Technology.',
  });
}
