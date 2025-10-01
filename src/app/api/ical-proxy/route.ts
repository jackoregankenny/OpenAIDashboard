import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

export async function GET(request: NextRequest) {
  const feedUrl = request.nextUrl.searchParams.get('url');

  if (!feedUrl) {
    return NextResponse.json(
      { error: 'Missing required "url" query parameter.' },
      { status: 400 }
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(feedUrl);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid feed URL provided.' },
      { status: 400 }
    );
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return NextResponse.json(
      { error: 'Only http and https URLs are supported.' },
      { status: 400 }
    );
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 15000);

  try {
    const upstream = await fetch(parsed.toString(), {
      signal: abortController.signal,
      headers: {
        'User-Agent':
          'OpenAIDashboard/ical-proxy (+https://github.com/openai)' ,
        Accept: 'text/calendar, text/plain;q=0.8, */*;q=0.5',
      },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: `Upstream calendar responded with status ${upstream.status}.`,
        },
        { status: upstream.status }
      );
    }

    const text = await upstream.text();

    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=900',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return NextResponse.json(
        { error: 'Calendar request timed out.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Unable to reach the calendar feed.' },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
