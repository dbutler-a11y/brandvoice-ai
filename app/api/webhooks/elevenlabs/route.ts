import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';
import { applyRateLimit } from '@/lib/ratelimit';
import { validateWebhookPayload } from '@/lib/validation';

/**
 * Verify ElevenLabs webhook signature using HMAC-SHA256
 * This provides cryptographic verification that the webhook came from ElevenLabs
 */
async function verifyWebhookSignature(
  request: Request,
  rawBody: string
): Promise<{ valid: boolean; error?: string }> {
  const webhookSecret = process.env.ELEVENLABS_WEBHOOK_SECRET;

  // If no secret configured, log warning but allow in development
  if (!webhookSecret) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[ElevenLabs Webhook] No webhook secret configured - skipping verification in development');
      return { valid: true };
    }
    console.error('[ElevenLabs Webhook] ELEVENLABS_WEBHOOK_SECRET not configured');
    return { valid: false, error: 'Webhook secret not configured' };
  }

  // Get signature from headers
  const signature = request.headers.get('x-elevenlabs-signature')
    || request.headers.get('x-signature')
    || request.headers.get('x-webhook-signature');

  if (!signature) {
    console.error('[ElevenLabs Webhook] Missing signature header');
    return { valid: false, error: 'Missing signature header' };
  }

  try {
    // Compute expected HMAC signature
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    // Check buffer lengths match first
    if (signatureBuffer.length !== expectedBuffer.length) {
      // If lengths don't match, try comparing as plain strings (some providers prefix with algorithm)
      const signatureWithoutPrefix = signature.replace(/^sha256=/, '');
      if (signatureWithoutPrefix === expectedSignature) {
        return { valid: true };
      }
      console.error('[ElevenLabs Webhook] Signature length mismatch');
      return { valid: false, error: 'Invalid signature' };
    }

    const isValid = timingSafeEqual(signatureBuffer, expectedBuffer);

    if (!isValid) {
      console.error('[ElevenLabs Webhook] Signature verification failed');
      return { valid: false, error: 'Invalid signature' };
    }

    return { valid: true };
  } catch (error) {
    console.error('[ElevenLabs Webhook] Error verifying signature:', error);
    return { valid: false, error: 'Signature verification error' };
  }
}

// ElevenLabs webhook payload types
interface ElevenLabsWebhookPayload {
  conversation_id: string;
  agent_id: string;
  status: 'completed' | 'failed' | 'in_progress';
  started_at?: string;
  ended_at?: string;
  duration_seconds?: number;
  transcript?: TranscriptEntry[];
  metadata?: Record<string, unknown>;
  collected_data?: Record<string, string>;
  [key: string]: unknown;
}

interface TranscriptEntry {
  role: 'user' | 'agent';
  message: string;
  timestamp?: string;
}

// Extract intake data from transcript using AI
async function extractIntakeData(transcript: TranscriptEntry[]): Promise<Record<string, string | null>> {
  const fullTranscript = transcript
    .map(entry => `${entry.role}: ${entry.message}`)
    .join('\n');

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('No OpenAI API key, skipping extraction');
    return {};
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a data extraction assistant. Extract the following information from the conversation transcript if mentioned. Return a JSON object with these keys (use null if not found):

- fullName: The person's full name
- email: Their email address
- phone: Their phone number
- businessName: Their business or company name
- businessType: Their industry or type of business
- website: Their website URL
- productsServices: What products or services they offer
- targetAudience: Who their customers/clients are
- videoGoals: What they want to achieve with video content
- currentVideoStrategy: Whether they're currently creating video and how
- timeline: When they want to get started
- budgetAllocated: Whether they've budgeted for video marketing
- budgetRange: Their approximate budget range
- socialPlatforms: Which social media platforms they use
- contentTopics: Topics they want covered in videos
- competitorExamples: Competitors or examples they mentioned liking
- spokespersonGender: Preferred spokesperson gender
- spokespersonAge: Preferred spokesperson age range
- spokespersonTone: Preferred tone or style
- interestedAddOns: Any add-ons they expressed interest in (voice cloning, dubbing, etc.)
- packageInterest: Which package they're interested in
- howHeardAboutUs: How they heard about the service
- biggestChallenge: Their main challenge with video marketing
- questionsOrConcerns: Any questions or concerns they raised
- preferredCallTime: When they're available for a discovery call

Only include information that was explicitly mentioned. Be accurate.`
          },
          {
            role: 'user',
            content: `Extract intake data from this conversation:\n\n${fullTranscript}`
          }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      console.error('OpenAI extraction failed:', await response.text());
      return {};
    }

    const data = await response.json();
    const extracted = JSON.parse(data.choices[0]?.message?.content || '{}');
    return extracted;
  } catch (error) {
    console.error('Error extracting data:', error);
    return {};
  }
}

// Generate conversation summary
async function generateSummary(transcript: TranscriptEntry[]): Promise<string> {
  const fullTranscript = transcript
    .map(entry => `${entry.role}: ${entry.message}`)
    .join('\n');

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return 'Summary unavailable - no API key';
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Summarize this sales conversation in 2-3 sentences. Include: who they are, what they need, and the outcome (e.g., booked call, needs follow-up, not interested).'
          },
          {
            role: 'user',
            content: fullTranscript
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      return 'Summary unavailable';
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Summary unavailable';
  } catch {
    return 'Summary unavailable';
  }
}

// Detect sentiment and intent
async function analyzeConversation(transcript: TranscriptEntry[]): Promise<{ sentiment: string; intent: string; outcome: string }> {
  const fullTranscript = transcript
    .map(entry => `${entry.role}: ${entry.message}`)
    .join('\n');

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return { sentiment: 'unknown', intent: 'unknown', outcome: 'unknown' };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Analyze this conversation and return JSON with:
- sentiment: "positive", "neutral", or "negative"
- intent: "purchase_intent", "information_seeking", "comparison_shopping", "not_interested", or "unclear"
- outcome: "booked_call", "requested_info", "will_think_about_it", "not_interested", "technical_issue", or "incomplete"`
          },
          {
            role: 'user',
            content: fullTranscript
          }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      return { sentiment: 'unknown', intent: 'unknown', outcome: 'unknown' };
    }

    const data = await response.json();
    return JSON.parse(data.choices[0]?.message?.content || '{}');
  } catch {
    return { sentiment: 'unknown', intent: 'unknown', outcome: 'unknown' };
  }
}

// Calculate lead quality score
function calculateLeadScore(data: Record<string, string | null>): number {
  let score = 0;

  // Contact info (high value)
  if (data.email) score += 20;
  if (data.phone) score += 15;
  if (data.fullName) score += 10;

  // Business info (medium-high value)
  if (data.businessName) score += 10;
  if (data.businessType) score += 5;
  if (data.website) score += 5;

  // Intent signals (high value)
  if (data.packageInterest) score += 15;
  if (data.timeline && data.timeline.toLowerCase().includes('soon') || data.timeline?.toLowerCase().includes('asap') || data.timeline?.toLowerCase().includes('immediately')) score += 10;
  if (data.budgetAllocated && data.budgetAllocated.toLowerCase().includes('yes')) score += 10;

  // Engagement signals
  if (data.videoGoals) score += 5;
  if (data.targetAudience) score += 3;
  if (data.socialPlatforms) score += 2;

  return Math.min(score, 100);
}

// Calculate data quality score
function calculateDataQuality(data: Record<string, string | null>): number {
  const importantFields = [
    'fullName', 'email', 'phone', 'businessName', 'businessType',
    'videoGoals', 'timeline', 'packageInterest'
  ];

  const filledFields = importantFields.filter(field => data[field] && data[field] !== null).length;
  return Math.round((filledFields / importantFields.length) * 100);
}

export async function POST(request: Request) {
  let rawBody = '';

  try {
    // Apply rate limiting (STANDARD - 30 requests per minute)
    const rateLimitCheck = applyRateLimit(request, 'STANDARD');
    if (rateLimitCheck.response) {
      console.warn('[ElevenLabs Webhook] Rate limit exceeded');
      return rateLimitCheck.response;
    }

    // Get raw body for signature verification
    rawBody = await request.text();

    // Verify webhook signature using HMAC
    const signatureVerification = await verifyWebhookSignature(request, rawBody);
    if (!signatureVerification.valid) {
      console.error('[ElevenLabs Webhook] Signature verification failed:', signatureVerification.error);
      return NextResponse.json(
        { error: signatureVerification.error || 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the payload
    const payload: ElevenLabsWebhookPayload = JSON.parse(rawBody);

    // Validate required fields
    const validation = validateWebhookPayload(payload, [
      'conversation_id',
      'agent_id',
      'status',
    ]);

    if (!validation.valid) {
      console.error('[ElevenLabs Webhook] Missing required fields:', validation.missing);
      return NextResponse.json(
        {
          error: 'Invalid payload',
          missing: validation.missing,
        },
        { status: 400 }
      );
    }

    console.log('Received ElevenLabs webhook:', payload.conversation_id);

    // Only process completed conversations
    if (payload.status !== 'completed') {
      return NextResponse.json({ message: 'Conversation not completed, skipping' });
    }

    const transcript = payload.transcript || [];
    const fullTranscriptText = transcript.map(e => `${e.role}: ${e.message}`).join('\n');

    // Extract data, generate summary, and analyze in parallel
    const [extractedData, summary, analysis] = await Promise.all([
      extractIntakeData(transcript),
      generateSummary(transcript),
      analyzeConversation(transcript)
    ]);

    // Calculate scores
    const leadScore = calculateLeadScore(extractedData);
    const dataQualityScore = calculateDataQuality(extractedData);
    const isQualified = leadScore >= 50;

    // Create or find lead
    let lead: Awaited<ReturnType<typeof prisma.lead.findFirst>> = null;

    // Try to find existing lead by email (duplicate prevention)
    if (extractedData.email) {
      lead = await prisma.lead.findFirst({
        where: { email: extractedData.email }
      });

      if (lead) {
        console.log(`[ElevenLabs Webhook] Found existing lead by email: ${lead.id}`);
      }
    }

    // Also check for duplicate by conversation ID to prevent reprocessing
    const existingConversation = await prisma.voiceConversation.findUnique({
      where: { elevenLabsConversationId: payload.conversation_id }
    });

    if (existingConversation) {
      console.log(`[ElevenLabs Webhook] Conversation already processed: ${payload.conversation_id}`);
      return NextResponse.json({
        success: true,
        message: 'Conversation already processed',
        leadId: existingConversation.leadId,
        conversationId: existingConversation.id,
      });
    }

    // Create new lead if not found
    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          fullName: extractedData.fullName || null,
          email: extractedData.email || null,
          phone: extractedData.phone || null,
          businessName: extractedData.businessName || null,
          businessType: extractedData.businessType || null,
          website: extractedData.website || null,
          productsServices: extractedData.productsServices || null,
          targetAudience: extractedData.targetAudience || null,
          videoGoals: extractedData.videoGoals || null,
          currentVideoStrategy: extractedData.currentVideoStrategy || null,
          timeline: extractedData.timeline || null,
          budgetAllocated: extractedData.budgetAllocated || null,
          budgetRange: extractedData.budgetRange || null,
          socialPlatforms: extractedData.socialPlatforms || null,
          contentTopics: extractedData.contentTopics || null,
          competitorExamples: extractedData.competitorExamples || null,
          spokespersonGender: extractedData.spokespersonGender || null,
          spokespersonAge: extractedData.spokespersonAge || null,
          spokespersonTone: extractedData.spokespersonTone || null,
          interestedAddOns: extractedData.interestedAddOns || null,
          packageInterest: extractedData.packageInterest || null,
          howHeardAboutUs: extractedData.howHeardAboutUs || null,
          biggestChallenge: extractedData.biggestChallenge || null,
          questionsOrConcerns: extractedData.questionsOrConcerns || null,
          preferredCallTime: extractedData.preferredCallTime || null,
          status: isQualified ? 'QUALIFIED' : 'NEW',
          score: leadScore,
          isQualified,
          qualifiedAt: isQualified ? new Date() : null,
          source: 'voice_agent',
          dataQualityScore,
          validationStatus: dataQualityScore >= 70 ? 'validated' : 'needs_review',
        }
      });
    } else {
      // Update existing lead with new data
      const updateData: Record<string, unknown> = {};

      // Only update fields that are currently null and have new values
      Object.entries(extractedData).forEach(([key, value]) => {
        if (value && (lead as Record<string, unknown>)[key] === null) {
          updateData[key] = value;
        }
      });

      // Update scores
      updateData.score = Math.max(lead.score, leadScore);
      updateData.dataQualityScore = Math.max(lead.dataQualityScore, dataQualityScore);

      if (!lead.isQualified && isQualified) {
        updateData.isQualified = true;
        updateData.qualifiedAt = new Date();
        updateData.status = 'QUALIFIED';
      }

      if (Object.keys(updateData).length > 0) {
        lead = await prisma.lead.update({
          where: { id: lead.id },
          data: updateData
        });
      }
    }

    // Store conversation record
    const conversation = await prisma.voiceConversation.create({
      data: {
        elevenLabsConversationId: payload.conversation_id,
        agentId: payload.agent_id,
        leadId: lead.id,
        startedAt: payload.started_at ? new Date(payload.started_at) : null,
        endedAt: payload.ended_at ? new Date(payload.ended_at) : null,
        durationSeconds: payload.duration_seconds || null,
        transcript: fullTranscriptText,
        summary,
        extractedData: JSON.stringify(extractedData),
        sentiment: analysis.sentiment,
        intentDetected: analysis.intent,
        outcome: analysis.outcome,
        callBooked: analysis.outcome === 'booked_call',
      }
    });

    console.log(`Processed conversation ${payload.conversation_id}, Lead ID: ${lead.id}, Score: ${leadScore}`);

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      conversationId: conversation.id,
      leadScore,
      dataQualityScore,
      isQualified
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing the webhook
export async function GET() {
  return NextResponse.json({
    message: 'ElevenLabs webhook endpoint is active',
    endpoint: '/api/webhooks/elevenlabs',
    method: 'POST',
    expectedPayload: {
      conversation_id: 'string',
      agent_id: 'string',
      status: 'completed | failed | in_progress',
      transcript: [{ role: 'user | agent', message: 'string' }]
    }
  });
}
