import { NextResponse } from 'next/server';
import { CronExpressionParser } from 'cron-parser';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const expr = String(body?.expr || '');

    const count = Math.min(
      Math.max(Number(body?.count || 10), 1),
      100
    );

    const interval = CronExpressionParser.parse(expr);
    const next = interval
      .take(count)
      .map((date) => date.toISOString());

    return NextResponse.json({ times: next });

  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 400 }
    );
  }
}