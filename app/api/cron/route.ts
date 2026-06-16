import { NextResponse } from 'next/server';
import { CronExpressionParser } from 'cron-parser';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const expr = String(body?.expr || '');

    const interval = CronExpressionParser.parse(expr);

    const next = interval.take(10).map((date) => date.toISOString());

    return NextResponse.json({ times: next });

  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 400 }
    );
  }
}