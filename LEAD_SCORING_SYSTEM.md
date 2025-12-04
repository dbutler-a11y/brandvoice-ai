# Lead Scoring System Documentation

## Overview

The automated lead scoring system evaluates leads on a 0-100 scale across four key dimensions to help prioritize sales efforts and identify high-value opportunities.

## Scoring Categories

### 1. Profile Completeness (0-25 points)
Measures how complete the lead's profile information is:
- Has email: **+5 points**
- Has phone: **+5 points**
- Has business name: **+5 points**
- Has website: **+5 points**
- Has budget info: **+5 points**

### 2. Engagement Signals (0-25 points)
Tracks the lead's interaction with your platform:
- Visited pricing page: **+10 points**
- Started checkout: **+15 points**
- Had voice conversation: **+10 points**
- Multiple conversations: **+5 points**

### 3. Business Fit (0-25 points)
Evaluates how well the lead matches your ideal customer profile:
- Budget range matches packages: **+15 points**
- Timeline is immediate: **+10 points**
- Has video marketing goals defined: **+5 points**

### 4. Intent Signals (0-25 points)
Identifies buying intent and readiness:
- Expressed purchase intent in conversation: **+15 points**
- Booked a call: **+20 points**
- Requested proposal: **+10 points**

## Lead Grades

Leads are assigned letter grades based on their total score:

- **Grade A** (80-100): Hot leads - Immediate follow-up required
- **Grade B** (60-79): Warm leads - Strong potential, active engagement needed
- **Grade C** (40-59): Cool leads - Nurture and educate
- **Grade D** (0-39): Cold leads - Long-term nurture or disqualify

## Auto-Qualification

Leads are automatically marked as qualified when:
- Score >= 70 points
- AND has minimum contact info (email OR phone)

When auto-qualified, the lead status changes from `NEW` to `QUALIFIED` automatically.

## Database Schema Changes

Added to the `Lead` model:

```prisma
scoreBreakdown Json?      // Detailed scoring breakdown
lastScoredAt   DateTime?  // Last time score was calculated
```

## API Endpoints

### 1. Get Lead Score
```
GET /api/leads/[id]/score
```

Returns the current score breakdown for a lead, including:
- Current score and grade
- Live calculated breakdown
- Stored breakdown from last calculation
- Whether the score needs updating

**Response:**
```json
{
  "leadId": "clx123...",
  "fullName": "John Doe",
  "email": "john@example.com",
  "status": "NEW",
  "currentScore": 65,
  "currentGrade": "B",
  "lastScoredAt": "2024-12-04T10:30:00Z",
  "isQualified": false,
  "qualifiedAt": null,
  "liveScoreBreakdown": {
    "total": 68,
    "profileCompleteness": {
      "score": 20,
      "maxScore": 25,
      "details": {
        "hasEmail": true,
        "hasPhone": true,
        "hasBusinessName": true,
        "hasWebsite": true,
        "hasBudgetInfo": false
      }
    },
    "engagementSignals": {
      "score": 20,
      "maxScore": 25,
      "details": {
        "visitedPricingPage": true,
        "startedCheckout": true,
        "hadVoiceConversation": true,
        "multipleConversations": false,
        "conversationCount": 1
      }
    },
    "businessFit": {
      "score": 15,
      "maxScore": 25,
      "details": {
        "budgetMatchesPackages": true,
        "timelineIsImmediate": false,
        "hasVideoMarketingGoals": false
      }
    },
    "intentSignals": {
      "score": 13,
      "maxScore": 25,
      "details": {
        "expressedPurchaseIntent": false,
        "bookedCall": false,
        "requestedProposal": true
      }
    },
    "grade": "B",
    "shouldAutoQualify": false,
    "calculatedAt": "2024-12-04T12:00:00Z"
  },
  "storedScoreBreakdown": { ... },
  "needsUpdate": false
}
```

### 2. Update Lead Score
```
POST /api/leads/[id]/score
PUT /api/leads/[id]/score
```

Recalculates and updates the lead score in the database.

**Response:**
```json
{
  "success": true,
  "message": "Lead score updated successfully",
  "lead": {
    "id": "clx123...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "status": "QUALIFIED",
    "score": 75,
    "grade": "B",
    "scoreBreakdown": { ... },
    "lastScoredAt": "2024-12-04T12:00:00Z",
    "isQualified": true,
    "qualifiedAt": "2024-12-04T12:00:00Z"
  },
  "conversations": [ ... ],
  "statusChanged": true,
  "autoQualified": true
}
```

### 3. Batch Scoring - Get Info
```
GET /api/leads/score/batch?daysOld=7
```

Returns statistics about lead scoring and identifies leads needing updates.

**Response:**
```json
{
  "stats": {
    "totalLeads": 150,
    "averageScore": 52.3,
    "gradeDistribution": {
      "A": 15,
      "B": 45,
      "C": 60,
      "D": 30
    },
    "autoQualifiedCount": 25,
    "needsReview": 10
  },
  "leadsNeedingUpdate": {
    "count": 10,
    "leads": [ ... ]
  }
}
```

### 4. Batch Scoring - Update
```
POST /api/leads/score/batch
```

Batch update scores for multiple leads.

**Request Body:**
```json
{
  "leadIds": ["clx123...", "clx456..."],  // Optional - specific leads
  "onlyStale": true,                       // Optional - only update stale leads
  "daysOld": 7                             // Optional - consider stale after X days
}
```

**Response:**
```json
{
  "success": true,
  "message": "Batch score update completed",
  "results": {
    "totalProcessed": 50,
    "successfulUpdates": 48,
    "failedUpdates": 2,
    "errors": [
      {
        "leadId": "clx789...",
        "error": "Lead not found"
      }
    ]
  }
}
```

## Library Functions

### Core Functions

```typescript
import {
  calculateLeadScore,
  updateLeadScore,
  getLeadGrade,
  shouldAutoQualifyLead,
  batchUpdateLeadScores,
  getLeadsNeedingScoreUpdate,
  getHighValueLeads,
  getLeadScoringStats
} from '@/lib/leadScoring';

// Calculate score without updating database
const scoreBreakdown = calculateLeadScore(leadWithConversations);

// Update score in database
const updatedLead = await updateLeadScore(leadId);

// Get grade from score
const grade = getLeadGrade(75); // Returns 'B'

// Check if should auto-qualify
const shouldQualify = shouldAutoQualifyLead(lead, 75); // Returns true

// Batch update scores
const results = await batchUpdateLeadScores(['id1', 'id2']);

// Get leads needing score update (older than 7 days)
const staleLeads = await getLeadsNeedingScoreUpdate(7);

// Get high-value leads (score >= 60)
const highValueLeads = await getHighValueLeads(60);

// Get scoring statistics
const stats = await getLeadScoringStats();
```

## Usage Examples

### Example 1: Score a New Lead
```typescript
// After creating a lead from voice conversation
const lead = await prisma.lead.create({ data: leadData });

// Calculate and store initial score
await updateLeadScore(lead.id);
```

### Example 2: Rescore After Conversation
```typescript
// After a new voice conversation is added
const conversation = await prisma.voiceConversation.create({
  data: conversationData
});

// Recalculate lead score
await updateLeadScore(conversation.leadId);
```

### Example 3: Daily Batch Scoring
```typescript
// Run as a cron job to update stale scores
const results = await batchUpdateLeadScores();
console.log(`Updated ${results.updated} leads`);
```

### Example 4: Get High-Priority Leads
```typescript
// Get A-grade leads for sales team
const hotLeads = await getHighValueLeads(80);

// Get all qualified leads
const qualifiedLeads = await prisma.lead.findMany({
  where: { isQualified: true, status: { notIn: ['WON', 'LOST'] } },
  orderBy: { score: 'desc' }
});
```

## Best Practices

1. **Score on Key Events**: Update scores when:
   - New lead is created
   - Voice conversation is completed
   - Lead information is updated
   - Status changes

2. **Regular Batch Updates**: Run daily batch updates for leads that haven't been scored recently

3. **Review Auto-Qualified Leads**: Check auto-qualified leads daily to ensure they receive immediate attention

4. **Monitor Statistics**: Track grade distribution to understand lead quality trends

5. **Customize Thresholds**: Adjust scoring thresholds based on your conversion data

## Automated Workflows

### Webhook Integration
Update scores automatically when events occur:

```typescript
// In your ElevenLabs webhook handler
export async function POST(request: Request) {
  const event = await request.json();

  if (event.type === 'conversation.completed') {
    // Update lead score after conversation
    await updateLeadScore(event.leadId);
  }
}
```

### Scheduled Jobs
Set up cron jobs to maintain scores:

```typescript
// Daily score maintenance (can be added to /api/cron/daily)
export async function GET() {
  // Update stale scores
  const results = await batchUpdateLeadScores();

  // Get high-value leads needing follow-up
  const hotLeads = await getHighValueLeads(80);

  // Send notifications to sales team
  await notifySalesTeam(hotLeads);

  return Response.json({ success: true, results });
}
```

## Monitoring & Analytics

### Key Metrics to Track

1. **Average Score**: Monitor overall lead quality trends
2. **Grade Distribution**: Understand your pipeline composition
3. **Auto-Qualification Rate**: Track efficiency of automatic qualification
4. **Score Changes Over Time**: Identify engagement patterns
5. **Conversion by Grade**: Measure scoring accuracy

### Dashboard Queries

```typescript
// Get leads by grade for dashboard
const leadsByGrade = {
  A: await prisma.lead.findMany({ where: { score: { gte: 80 } } }),
  B: await prisma.lead.findMany({ where: { score: { gte: 60, lt: 80 } } }),
  C: await prisma.lead.findMany({ where: { score: { gte: 40, lt: 60 } } }),
  D: await prisma.lead.findMany({ where: { score: { lt: 40 } } })
};

// Recent score changes
const recentlyScored = await prisma.lead.findMany({
  where: {
    lastScoredAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  },
  orderBy: { lastScoredAt: 'desc' }
});
```

## Migration Guide

To add lead scoring to existing leads:

```bash
# 1. Generate Prisma client with new schema
npx prisma generate

# 2. Push schema changes to database
npx prisma db push

# 3. Score all existing leads (via API or script)
curl -X POST http://localhost:3000/api/leads/score/batch \
  -H "Content-Type: application/json" \
  -d '{}'
```

Or create a migration script:

```typescript
// scripts/score-all-leads.ts
import { batchUpdateLeadScores } from '@/lib/leadScoring';

async function main() {
  console.log('Starting batch score update...');
  const results = await batchUpdateLeadScores();
  console.log('Results:', results);
}

main();
```

## Troubleshooting

### Score Not Updating
- Check that `lastScoredAt` is being set
- Verify conversations are properly linked to leads
- Ensure all required fields are present

### Incorrect Scoring
- Review the scoring algorithm in `/lib/leadScoring.ts`
- Check that conversation data includes `intentDetected`, `outcome`, etc.
- Verify budget range parsing logic

### Performance Issues
- Use batch updates for multiple leads
- Add database indexes if querying by score frequently
- Consider caching score statistics

## Future Enhancements

Potential improvements to the scoring system:

1. **Machine Learning**: Train models on conversion data to optimize weights
2. **Custom Scoring Rules**: Allow admin to configure scoring weights
3. **Score History**: Track score changes over time
4. **Predictive Scoring**: Predict likelihood to close based on patterns
5. **Integration Triggers**: Auto-create tasks when score thresholds are met
6. **A/B Testing**: Test different scoring algorithms
