# Lead Scoring System - Implementation Summary

## Overview
A comprehensive automated lead scoring system that evaluates leads on a 0-100 scale across four key dimensions to help prioritize sales efforts and identify high-value opportunities.

## Files Created

### 1. Core Library
**Location:** `/lib/leadScoring.ts` (12KB)

**Functions:**
- `calculateLeadScore(lead)` - Calculate score with detailed breakdown
- `updateLeadScore(leadId)` - Update score in database
- `getLeadGrade(score)` - Convert score to letter grade (A/B/C/D)
- `shouldAutoQualifyLead(lead, score)` - Determine auto-qualification
- `batchUpdateLeadScores(leadIds?)` - Batch update multiple leads
- `getLeadsNeedingScoreUpdate(daysOld)` - Find stale scores
- `getHighValueLeads(minScore)` - Get leads above threshold
- `getLeadScoringStats()` - Get scoring statistics

### 2. Type Definitions
**Location:** `/lib/types/leadScoring.ts` (5KB)

**Key Types:**
- `ScoreBreakdown` - Complete scoring details
- `LeadWithConversations` - Lead with related data
- `LeadScoringStats` - Statistics interface
- API response types for all endpoints
- Helper type guards and utilities

### 3. API Endpoints

#### Single Lead Scoring
**Location:** `/app/api/leads/[id]/score/route.ts` (4KB)

- **GET** `/api/leads/[id]/score`
  - Returns current score breakdown
  - Shows live vs stored score
  - Indicates if update needed

- **POST/PUT** `/api/leads/[id]/score`
  - Recalculates and updates score
  - Returns updated lead data
  - Shows status changes and auto-qualification

#### Batch Scoring
**Location:** `/app/api/leads/score/batch/route.ts` (2.7KB)

- **GET** `/api/leads/score/batch?daysOld=7`
  - Returns scoring statistics
  - Lists leads needing updates

- **POST** `/api/leads/score/batch`
  - Batch updates multiple leads
  - Supports filtering by stale scores
  - Returns detailed results

### 4. React Hooks
**Location:** `/hooks/useLeadScoring.ts` (8KB)

**Hooks:**
- `useLeadScore(leadId)` - Fetch/update single lead score
- `useBatchScoring()` - Batch operations and stats
- `useScoreGrade(score)` - Grade, color, label, priority
- `useScoreCalculator()` - Client-side score calculation
- `useScoreFormatter()` - Format breakdown for display

### 5. Example Script
**Location:** `/scripts/example-lead-scoring.ts` (6KB)

Demonstrates:
- Fetching leads with scores
- Updating individual scores
- Finding stale scores
- Getting high-value leads
- Viewing detailed breakdowns
- Batch operations

### 6. Documentation
**Location:** `/LEAD_SCORING_SYSTEM.md` (17KB)

Complete documentation including:
- Scoring methodology
- API reference
- Usage examples
- Best practices
- Troubleshooting
- Migration guide

### 7. Database Schema Updates
**Location:** `/prisma/schema.prisma`

Added to Lead model:
```prisma
scoreBreakdown Json?      // Detailed scoring breakdown
lastScoredAt   DateTime?  // Last time score was calculated
```

## Scoring Algorithm

### Profile Completeness (0-25 points)
- Has email: **+5**
- Has phone: **+5**
- Has business name: **+5**
- Has website: **+5**
- Has budget info: **+5**

### Engagement Signals (0-25 points)
- Visited pricing page: **+10**
- Started checkout: **+15**
- Had voice conversation: **+10**
- Multiple conversations: **+5**

### Business Fit (0-25 points)
- Budget matches packages: **+15**
- Timeline is immediate: **+10**
- Has video marketing goals: **+5**

### Intent Signals (0-25 points)
- Expressed purchase intent: **+15**
- Booked call: **+20**
- Requested proposal: **+10**

## Grading System

- **Grade A (80-100)**: Hot leads - Immediate follow-up required
- **Grade B (60-79)**: Warm leads - Strong potential
- **Grade C (40-59)**: Cool leads - Nurture and educate
- **Grade D (0-39)**: Cold leads - Long-term nurture

## Auto-Qualification

Leads are automatically qualified when:
- Score >= 70 points
- Has email OR phone

When qualified:
- `isQualified` set to `true`
- `qualifiedAt` timestamp recorded
- Status changes from `NEW` to `QUALIFIED`

## Quick Start

### 1. Score a Single Lead
```typescript
import { updateLeadScore } from '@/lib/leadScoring';

// Update lead score
const updatedLead = await updateLeadScore('lead-id');
console.log(`Score: ${updatedLead.score}`);
```

### 2. Get High-Value Leads
```typescript
import { getHighValueLeads } from '@/lib/leadScoring';

// Get leads with score >= 70
const hotLeads = await getHighValueLeads(70);
```

### 3. Batch Update
```typescript
import { batchUpdateLeadScores } from '@/lib/leadScoring';

// Update all leads
const results = await batchUpdateLeadScores();
console.log(`Updated ${results.updated} leads`);
```

### 4. Get Statistics
```typescript
import { getLeadScoringStats } from '@/lib/leadScoring';

const stats = await getLeadScoringStats();
console.log(`Average score: ${stats.averageScore}`);
console.log(`Grade A: ${stats.gradeDistribution.A} leads`);
```

## API Usage Examples

### Get Score Breakdown
```bash
curl http://localhost:3000/api/leads/clx123/score
```

### Update Score
```bash
curl -X POST http://localhost:3000/api/leads/clx123/score
```

### Get Statistics
```bash
curl http://localhost:3000/api/leads/score/batch
```

### Batch Update Stale Scores
```bash
curl -X POST http://localhost:3000/api/leads/score/batch \
  -H "Content-Type: application/json" \
  -d '{"onlyStale": true, "daysOld": 7}'
```

## React Hook Usage

### Display Lead Score
```tsx
import { useLeadScore, useScoreGrade } from '@/hooks/useLeadScoring';

function LeadDetails({ leadId }) {
  const { scoreData, loading, fetchScore } = useLeadScore(leadId);
  const { grade, color, label } = useScoreGrade(scoreData?.currentScore || 0);

  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <span className={color}>{grade}</span>
      <span>{label}</span>
      <span>Score: {scoreData?.currentScore}</span>
    </div>
  );
}
```

### Update Score Button
```tsx
function UpdateScoreButton({ leadId }) {
  const { updateScore, loading } = useLeadScore(leadId);

  return (
    <button
      onClick={updateScore}
      disabled={loading}
    >
      {loading ? 'Updating...' : 'Update Score'}
    </button>
  );
}
```

### Display Statistics
```tsx
import { useBatchScoring } from '@/hooks/useLeadScoring';

function ScoringStats() {
  const { stats, fetchStats } = useBatchScoring();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div>
      <h3>Lead Scoring Statistics</h3>
      <p>Total Leads: {stats?.totalLeads}</p>
      <p>Average Score: {stats?.averageScore}</p>
      <div>
        <p>Grade A: {stats?.gradeDistribution.A}</p>
        <p>Grade B: {stats?.gradeDistribution.B}</p>
        <p>Grade C: {stats?.gradeDistribution.C}</p>
        <p>Grade D: {stats?.gradeDistribution.D}</p>
      </div>
    </div>
  );
}
```

## Integration Points

### 1. After Lead Creation
```typescript
// In /app/api/leads/route.ts POST handler
const lead = await prisma.lead.create({ data });
await updateLeadScore(lead.id);
```

### 2. After Voice Conversation
```typescript
// In voice conversation webhook handler
const conversation = await prisma.voiceConversation.create({ data });
if (conversation.leadId) {
  await updateLeadScore(conversation.leadId);
}
```

### 3. After Lead Update
```typescript
// In /app/api/leads/[id]/route.ts PUT handler
const lead = await prisma.lead.update({ where: { id }, data });
await updateLeadScore(lead.id);
```

### 4. Scheduled Job
```typescript
// In /app/api/cron/daily/route.ts
export async function GET() {
  const results = await batchUpdateLeadScores();
  return Response.json({ success: true, results });
}
```

## Testing

### Run Example Script
```bash
npx ts-node scripts/example-lead-scoring.ts
```

### Test API Endpoints
```bash
# Get all leads
curl http://localhost:3000/api/leads

# Score first lead
LEAD_ID=$(curl -s http://localhost:3000/api/leads | jq -r '.leads[0].id')
curl http://localhost:3000/api/leads/$LEAD_ID/score

# Update score
curl -X POST http://localhost:3000/api/leads/$LEAD_ID/score

# Get stats
curl http://localhost:3000/api/leads/score/batch
```

## Next Steps

1. **Initial Scoring**: Run batch update to score all existing leads
   ```bash
   curl -X POST http://localhost:3000/api/leads/score/batch
   ```

2. **Add to Workflows**: Integrate scoring into lead creation and update flows

3. **Create Dashboard**: Build admin UI to view scoring statistics

4. **Set Up Automation**: Create cron job for daily score updates

5. **Add Notifications**: Alert sales team when high-value leads are identified

6. **Customize Weights**: Adjust scoring weights based on conversion data

## Maintenance

### Daily Tasks
- Check auto-qualified leads
- Review high-value leads (Grade A)
- Update stale scores (>7 days old)

### Weekly Tasks
- Review scoring statistics
- Analyze grade distribution
- Identify trends in lead quality

### Monthly Tasks
- Optimize scoring weights
- Review auto-qualification threshold
- Analyze correlation with conversions

## Performance Considerations

- Scores are cached in database (not recalculated on every request)
- Use `GET /api/leads/[id]/score` to check without updating
- Batch updates process leads sequentially to avoid DB overload
- Consider running batch updates during off-peak hours

## Security Notes

- API endpoints should be protected with authentication
- Only admins should access batch scoring endpoints
- Consider rate limiting for score update requests
- Log all score updates for audit trail

## Support

For questions or issues:
1. Check `/LEAD_SCORING_SYSTEM.md` for detailed documentation
2. Review `/scripts/example-lead-scoring.ts` for usage examples
3. Test with example data before production use
4. Monitor logs for errors during batch updates
