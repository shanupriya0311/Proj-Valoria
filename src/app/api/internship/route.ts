
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

type ApplicationPayload = {
  Firstname: string;
  Lastname: string;
  email: string;
  password: string;
  Phone: string;
  Degree: string;
  Course: string;
  YOG: number;
  State: string;
  District: string;
  CollegeName: string;
  Department: string;
};

function isApplicationPayload(
  value: unknown
): value is ApplicationPayload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.Firstname === 'string' &&
    typeof payload.Lastname === 'string' &&
    typeof payload.email === 'string' &&
    typeof payload.password === 'string' &&
    typeof payload.Phone === 'string' &&
    typeof payload.Degree === 'string' &&
    typeof payload.Course === 'string' &&
    typeof payload.YOG === 'number' &&
    Number.isInteger(payload.YOG) &&
    payload.YOG > 0 &&
    typeof payload.State === 'string' &&
    typeof payload.District === 'string' &&
    typeof payload.CollegeName === 'string' &&
    typeof payload.Department === 'string'
  );
}

export async function POST(request: Request) {
  try {
    // 1. Parse request body
    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Please submit a valid internship application.',
        },
        { status: 400 }
      );
    }

    // 2. Validate incoming data
    if (!isApplicationPayload(payload)) {
      return NextResponse.json(
        {
          success: false,
          message: 'One or more required application fields are missing or invalid.',
        },
        { status: 400 }
      );
    }

    // 3. Map frontend fields to exact Supabase column names
    const studentData = {
      Firstname: payload.Firstname.trim(),
      Lastname: payload.Lastname.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      Phone: payload.Phone.trim(),
      Degree: payload.Degree.trim(),
      Course: payload.Course.trim(),
      YOG: payload.YOG,
      State: payload.State.trim(),
      District: payload.District.trim(),
      CollegeName: payload.CollegeName.trim(),
      Department: payload.Department.trim(),
    };

    // 4. Validate required fields
    if (
      !studentData.Firstname ||
      !studentData.Lastname ||
      !studentData.email ||
      !studentData.password ||
      !studentData.Phone ||
      !studentData.Degree ||
      !studentData.Course ||
      !studentData.State ||
      !studentData.District ||
      !studentData.CollegeName ||
      !studentData.Department ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide all valid application details.',
        },
        { status: 400 }
      );
    }

    // 5. Read Supabase configuration
    const supabaseUrl =
      process.env.SUPABASE_URL?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY?.trim() ||
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!supabaseUrl || !supabaseKey) {
      console.error('[Internship] Supabase configuration missing:', {
        urlAvailable: Boolean(supabaseUrl),
        secretAvailable: Boolean(supabaseKey),
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Supabase server configuration is missing.',
        },
        { status: 503 }
      );
    }

    // 6. Validate Supabase URL
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(supabaseUrl);
    } catch {
      console.error('[Internship] Invalid Supabase URL format.');

      return NextResponse.json(
        {
          success: false,
          message: 'Invalid Supabase URL configuration.',
        },
        { status: 503 }
      );
    }

    if (
      parsedUrl.protocol !== 'https:' ||
      !parsedUrl.hostname.endsWith('.supabase.co')
    ) {
      console.error('[Internship] Invalid Supabase hostname or protocol:', {
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Invalid Supabase connection URL.',
        },
        { status: 503 }
      );
    }

    console.log('[Internship] Supabase target:', {
      hostname: parsedUrl.hostname,
      protocol: parsedUrl.protocol,
    });

    // 7. Diagnostic fetch for Cloudflare outbound requests
    const diagnosticFetch: typeof fetch = async (input, init) => {
      const requestUrl =
        input instanceof Request
          ? input.url
          : input instanceof URL
            ? input.href
            : String(input);

      let hostname = 'unknown';

      try {
        hostname = new URL(requestUrl).hostname;
      } catch {
        console.error('[Internship] Invalid outbound request URL.');
        throw new Error('Invalid outbound request URL.');
      }

      console.log('[Internship] Outbound request:', { hostname });

      try {
        const response = await fetch(input, init);

        console.log('[Internship] Outbound response:', {
          hostname,
          status: response.status,
        });

        if (!response.ok) {
          const responseText = await response.clone().text();

          console.error('[Internship] Outbound HTTP error:', {
            hostname,
            status: response.status,
            response: responseText.slice(0, 300),
          });
        }

        return response;
      } catch (error) {
        console.error('[Internship] Outbound network failure:', {
          hostname,
          message:
            error instanceof Error ? error.message : 'Unknown network error',
        });

        throw error;
      }
    };

    // 8. Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: diagnosticFetch,
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // 9. Insert application into Students table
<<<<<<< HEAD
   // 9. Insert application into Students table
const { data, error } = await supabase

  .from('Students')
  .insert(studentData)
  .select(`
    Firstname,
    Lastname,
    email,
    Phone,
    Degree,
    Course,
    YOG,
    State,
    District,
    CollegeName,
    Department
  `)
  .single();
=======
    const { data, error } = await supabase
      .from('Students')
      .insert(studentData)
      .select('Firstname, Lastname, email, Phone, Degree, Course, YOG')
      .single();

>>>>>>> origin/main
    // 10. Handle database errors
    if (error) {
      console.error('[Internship] Supabase database error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      if (error.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            message: 'An application with this email or phone number already exists.',
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to save your application.',
          errorCode: error.code || 'UNKNOWN_DATABASE_ERROR',
        },
        { status: 500 }
      );
    }

    // 12. Successful insertion
    console.log('[Internship] Application successfully saved.');

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully!',
        student: data,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('[Internship] Unexpected server error:', {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : 'Unknown server error',
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
