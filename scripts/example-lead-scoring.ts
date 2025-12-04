/**
 * Example script demonstrating Lead Scoring System usage
 *
 * Run with: npx ts-node scripts/example-lead-scoring.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  calculateLeadScore,
  updateLeadScore,
  getLeadGrade,
  batchUpdateLeadScores,
  getLeadsNeedingScoreUpdate,
  getHighValueLeads,
  getLeadScoringStats
} from '../lib/leadScoring';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Lead Scoring System Examples ===\n');

  try {
    // Example 1: Get all leads and their current scores
    console.log('1. Fetching all leads with current scores...');
    const leads = await prisma.lead.findMany({
      where: {
        status: { notIn: ['WON', 'LOST'] }
      },
      orderBy: { score: 'desc' },
      take: 5
    });

    console.log(`Found ${leads.length} active leads:`);
    leads.forEach(lead => {
      console.log(`  - ${lead.fullName || 'Unnamed'} (${lead.email}): Score ${lead.score}, Grade ${getLeadGrade(lead.score)}`);
    });
    console.log();

    // Example 2: Calculate and update score for a specific lead
    if (leads.length > 0) {
      const leadToScore = leads[0];
      console.log(`2. Updating score for lead: ${leadToScore.fullName || leadToScore.email}...`);

      const updatedLead = await updateLeadScore(leadToScore.id);

      console.log(`  Old score: ${leadToScore.score}`);
      console.log(`  New score: ${updatedLead.score}`);
      console.log(`  Grade: ${getLeadGrade(updatedLead.score)}`);
      console.log(`  Qualified: ${updatedLead.isQualified}`);
      console.log();
    }

    // Example 3: Get leads needing score updates
    console.log('3. Finding leads needing score updates (older than 7 days)...');
    const staleLeads = await getLeadsNeedingScoreUpdate(7);
    console.log(`Found ${staleLeads.length} leads with stale scores`);

    if (staleLeads.length > 0) {
      console.log('  Examples:');
      staleLeads.slice(0, 3).forEach(lead => {
        console.log(`  - ${lead.fullName || 'Unnamed'}: Last scored ${lead.lastScoredAt ? new Date(lead.lastScoredAt).toLocaleDateString() : 'never'}`);
      });
    }
    console.log();

    // Example 4: Get high-value leads
    console.log('4. Fetching high-value leads (score >= 60)...');
    const highValueLeads = await getHighValueLeads(60);
    console.log(`Found ${highValueLeads.length} high-value leads:`);

    if (highValueLeads.length > 0) {
      highValueLeads.slice(0, 5).forEach(lead => {
        console.log(`  - ${lead.fullName || 'Unnamed'} (${lead.email}): Score ${lead.score}, Status: ${lead.status}`);
      });
    } else {
      console.log('  No high-value leads found.');
    }
    console.log();

    // Example 5: Get scoring statistics
    console.log('5. Getting overall scoring statistics...');
    const stats = await getLeadScoringStats();
    console.log(`  Total leads: ${stats.totalLeads}`);
    console.log(`  Average score: ${stats.averageScore}`);
    console.log('  Grade distribution:');
    console.log(`    A (80-100): ${stats.gradeDistribution.A} leads`);
    console.log(`    B (60-79):  ${stats.gradeDistribution.B} leads`);
    console.log(`    C (40-59):  ${stats.gradeDistribution.C} leads`);
    console.log(`    D (0-39):   ${stats.gradeDistribution.D} leads`);
    console.log(`  Auto-qualified: ${stats.autoQualifiedCount} leads`);
    console.log(`  Needs review: ${stats.needsReview} leads`);
    console.log();

    // Example 6: Batch update scores (commented out to prevent accidental execution)
    console.log('6. Batch score update (example - not executed)');
    console.log('   To update all stale leads, uncomment and run:');
    console.log('   const results = await batchUpdateLeadScores();');
    console.log();

    // Uncomment to actually run batch update:
    /*
    if (staleLeads.length > 0) {
      console.log('   Running batch update...');
      const staleLeadIds = staleLeads.map(l => l.id);
      const results = await batchUpdateLeadScores(staleLeadIds);
      console.log(`   Updated ${results.updated} of ${results.processed} leads`);
      if (results.errors.length > 0) {
        console.log(`   Errors: ${results.errors.length}`);
      }
    }
    */

    // Example 7: Get detailed score breakdown for a lead
    if (leads.length > 0) {
      const leadForDetails = leads[0];
      console.log('7. Getting detailed score breakdown...');

      const leadWithConversations = await prisma.lead.findUnique({
        where: { id: leadForDetails.id },
        include: { conversations: true }
      });

      if (leadWithConversations) {
        const breakdown = calculateLeadScore(leadWithConversations as any);

        console.log(`  Lead: ${leadWithConversations.fullName || leadWithConversations.email}`);
        console.log(`  Total Score: ${breakdown.total}/100 (Grade ${breakdown.grade})`);
        console.log();
        console.log('  Breakdown:');
        console.log(`    Profile Completeness: ${breakdown.profileCompleteness.score}/25`);
        console.log(`      - Has email: ${breakdown.profileCompleteness.details.hasEmail}`);
        console.log(`      - Has phone: ${breakdown.profileCompleteness.details.hasPhone}`);
        console.log(`      - Has business name: ${breakdown.profileCompleteness.details.hasBusinessName}`);
        console.log(`      - Has website: ${breakdown.profileCompleteness.details.hasWebsite}`);
        console.log(`      - Has budget info: ${breakdown.profileCompleteness.details.hasBudgetInfo}`);
        console.log();
        console.log(`    Engagement Signals: ${breakdown.engagementSignals.score}/25`);
        console.log(`      - Visited pricing: ${breakdown.engagementSignals.details.visitedPricingPage}`);
        console.log(`      - Started checkout: ${breakdown.engagementSignals.details.startedCheckout}`);
        console.log(`      - Had conversation: ${breakdown.engagementSignals.details.hadVoiceConversation}`);
        console.log(`      - Multiple conversations: ${breakdown.engagementSignals.details.multipleConversations} (${breakdown.engagementSignals.details.conversationCount} total)`);
        console.log();
        console.log(`    Business Fit: ${breakdown.businessFit.score}/25`);
        console.log(`      - Budget matches packages: ${breakdown.businessFit.details.budgetMatchesPackages}`);
        console.log(`      - Timeline immediate: ${breakdown.businessFit.details.timelineIsImmediate}`);
        console.log(`      - Has marketing goals: ${breakdown.businessFit.details.hasVideoMarketingGoals}`);
        console.log();
        console.log(`    Intent Signals: ${breakdown.intentSignals.score}/25`);
        console.log(`      - Purchase intent: ${breakdown.intentSignals.details.expressedPurchaseIntent}`);
        console.log(`      - Booked call: ${breakdown.intentSignals.details.bookedCall}`);
        console.log(`      - Requested proposal: ${breakdown.intentSignals.details.requestedProposal}`);
        console.log();
        console.log(`  Should Auto-Qualify: ${breakdown.shouldAutoQualify}`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the examples
main()
  .then(() => {
    console.log('\n=== Examples completed successfully ===');
  })
  .catch((error) => {
    console.error('Failed to run examples:', error);
    process.exit(1);
  });
