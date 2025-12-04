import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/health - Health check endpoint for monitoring
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown',
      services: {
        paypal: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 'configured' : 'missing',
        elevenlabs: process.env.ELEVENLABS_API_KEY ? 'configured' : 'missing',
        resend: process.env.RESEND_API_KEY ? 'configured' : 'missing',
        openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing',
      },
    },
  };

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'connected';
  } catch {
    health.checks.database = 'disconnected';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
