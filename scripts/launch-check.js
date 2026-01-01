#!/usr/bin/env node

/**
 * BrandVoice Studio - Launch Readiness Check
 *
 * Runs comprehensive checks:
 * 1. Playwright E2E tests (Does it work?)
 * 2. Lighthouse audits (Is it fast/accessible/SEO-ready?)
 * 3. Security audit (Are dependencies secure?)
 *
 * Usage: npm run launch-check
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`),
  header: (msg) => console.log(`${colors.bright}${colors.blue}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
};

const results = {
  playwright: { passed: 0, failed: 0, total: 0 },
  lighthouse: { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 },
  security: { vulnerabilities: { low: 0, moderate: 0, high: 0, critical: 0 } },
};

async function runPlaywright() {
  log.title();
  log.header('📋 SECTION 1: FUNCTIONAL TESTS (Playwright)');
  log.info('Testing if core features work...\n');

  try {
    const output = execSync('npx playwright test --reporter=json 2>/dev/null || true', {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });

    try {
      const jsonOutput = JSON.parse(output);
      const stats = jsonOutput.stats || {};
      results.playwright.passed = stats.expected || 0;
      results.playwright.failed = (stats.unexpected || 0) + (stats.flaky || 0);
      results.playwright.total = results.playwright.passed + results.playwright.failed;

      if (results.playwright.failed === 0) {
        log.success(`All ${results.playwright.passed} tests passed!`);
      } else {
        log.warning(`${results.playwright.passed}/${results.playwright.total} tests passed`);
        log.error(`${results.playwright.failed} tests failed`);
      }
    } catch (parseError) {
      // Fallback: parse text output
      const passMatch = output.match(/(\d+) passed/);
      const failMatch = output.match(/(\d+) failed/);
      results.playwright.passed = passMatch ? parseInt(passMatch[1]) : 0;
      results.playwright.failed = failMatch ? parseInt(failMatch[1]) : 0;
      results.playwright.total = results.playwright.passed + results.playwright.failed;

      log.info(`${results.playwright.passed} passed, ${results.playwright.failed} failed`);
    }
  } catch (error) {
    log.error('Playwright tests could not run');
    log.info('Run "npm run test" separately for details');
  }

  const score = results.playwright.total > 0
    ? Math.round((results.playwright.passed / results.playwright.total) * 100)
    : 0;
  console.log(`\n   Functional Score: ${score}%`);
  return score;
}

async function runLighthouse() {
  log.title();
  log.header('🚀 SECTION 2: PERFORMANCE & QUALITY (Lighthouse)');
  log.info('Auditing performance, accessibility, SEO...\n');

  const baseUrl = 'http://localhost:3000';
  const pages = [
    { name: 'Homepage', url: '/' },
    { name: 'Pricing', url: '/pricing' },
  ];

  for (const page of pages) {
    log.info(`Auditing ${page.name}...`);

    try {
      const reportPath = `/tmp/lighthouse-${page.name.toLowerCase()}.json`;

      execSync(
        `npx lighthouse ${baseUrl}${page.url} --output=json --output-path=${reportPath} --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --quiet 2>/dev/null`,
        { encoding: 'utf-8', timeout: 120000 }
      );

      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      const scores = {
        performance: Math.round((report.categories.performance?.score || 0) * 100),
        accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((report.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((report.categories.seo?.score || 0) * 100),
      };

      // Update aggregate scores (average)
      if (results.lighthouse.performance === 0) {
        results.lighthouse = scores;
      } else {
        results.lighthouse.performance = Math.round((results.lighthouse.performance + scores.performance) / 2);
        results.lighthouse.accessibility = Math.round((results.lighthouse.accessibility + scores.accessibility) / 2);
        results.lighthouse.bestPractices = Math.round((results.lighthouse.bestPractices + scores.bestPractices) / 2);
        results.lighthouse.seo = Math.round((results.lighthouse.seo + scores.seo) / 2);
      }

      const getColor = (score) => score >= 90 ? colors.green : score >= 50 ? colors.yellow : colors.red;

      console.log(`   ${page.name}:`);
      console.log(`     ${getColor(scores.performance)}Performance: ${scores.performance}${colors.reset}`);
      console.log(`     ${getColor(scores.accessibility)}Accessibility: ${scores.accessibility}${colors.reset}`);
      console.log(`     ${getColor(scores.bestPractices)}Best Practices: ${scores.bestPractices}${colors.reset}`);
      console.log(`     ${getColor(scores.seo)}SEO: ${scores.seo}${colors.reset}`);
      console.log('');

    } catch (error) {
      log.warning(`Could not audit ${page.name} - is the dev server running?`);
    }
  }

  const avgScore = Math.round(
    (results.lighthouse.performance +
     results.lighthouse.accessibility +
     results.lighthouse.bestPractices +
     results.lighthouse.seo) / 4
  );

  console.log(`   Overall Quality Score: ${avgScore}%`);
  return avgScore;
}

async function runSecurityAudit() {
  log.title();
  log.header('🔒 SECTION 3: SECURITY AUDIT');
  log.info('Checking for vulnerable dependencies...\n');

  let vulnScore = 100;
  let headersScore = 100;

  // Part 1: npm audit
  try {
    const output = execSync('npm audit --json 2>/dev/null || true', {
      encoding: 'utf-8',
    });

    try {
      const audit = JSON.parse(output);
      const vulns = audit.metadata?.vulnerabilities || {};

      results.security.vulnerabilities = {
        low: vulns.low || 0,
        moderate: vulns.moderate || 0,
        high: vulns.high || 0,
        critical: vulns.critical || 0,
      };

      const total = results.security.vulnerabilities.low +
                   results.security.vulnerabilities.moderate +
                   results.security.vulnerabilities.high +
                   results.security.vulnerabilities.critical;

      if (total === 0) {
        log.success('No dependency vulnerabilities found!');
      } else {
        if (results.security.vulnerabilities.critical > 0) {
          log.error(`Critical: ${results.security.vulnerabilities.critical}`);
        }
        if (results.security.vulnerabilities.high > 0) {
          log.error(`High: ${results.security.vulnerabilities.high}`);
        }
        if (results.security.vulnerabilities.moderate > 0) {
          log.warning(`Moderate: ${results.security.vulnerabilities.moderate}`);
        }
        if (results.security.vulnerabilities.low > 0) {
          log.info(`Low: ${results.security.vulnerabilities.low}`);
        }
      }

      // Score: 100 minus penalties
      const penalty =
        (results.security.vulnerabilities.critical * 25) +
        (results.security.vulnerabilities.high * 15) +
        (results.security.vulnerabilities.moderate * 5) +
        (results.security.vulnerabilities.low * 1);

      vulnScore = Math.max(0, 100 - penalty);

    } catch (parseError) {
      log.warning('Could not parse audit results');
      vulnScore = 50;
    }
  } catch (error) {
    log.error('npm audit failed');
    vulnScore = 0;
  }

  // Part 2: Security Headers Check
  console.log('');
  log.info('Checking security headers...\n');

  const requiredHeaders = [
    { name: 'X-Frame-Options', importance: 'high' },
    { name: 'X-Content-Type-Options', importance: 'high' },
    { name: 'X-XSS-Protection', importance: 'medium' },
    { name: 'Referrer-Policy', importance: 'medium' },
    { name: 'Content-Security-Policy', importance: 'high' },
    { name: 'Permissions-Policy', importance: 'low' },
  ];

  try {
    const response = execSync('curl -sI http://localhost:3000 2>/dev/null || true', {
      encoding: 'utf-8',
    });

    let headersFound = 0;
    let headersPenalty = 0;

    requiredHeaders.forEach(header => {
      const hasHeader = response.toLowerCase().includes(header.name.toLowerCase());
      if (hasHeader) {
        log.success(`${header.name} present`);
        headersFound++;
      } else {
        if (header.importance === 'high') {
          log.error(`${header.name} missing (high priority)`);
          headersPenalty += 15;
        } else if (header.importance === 'medium') {
          log.warning(`${header.name} missing (medium priority)`);
          headersPenalty += 8;
        } else {
          log.info(`${header.name} missing (low priority)`);
          headersPenalty += 3;
        }
      }
    });

    headersScore = Math.max(0, 100 - headersPenalty);
    console.log(`\n   Headers: ${headersFound}/${requiredHeaders.length} present`);

  } catch (error) {
    log.warning('Could not check security headers - is server running?');
    headersScore = 50;
  }

  // Combined security score (weighted: 60% vulnerabilities, 40% headers)
  const score = Math.round((vulnScore * 0.6) + (headersScore * 0.4));
  console.log(`\n   Dependency Score: ${vulnScore}%`);
  console.log(`   Headers Score: ${headersScore}%`);
  console.log(`   Combined Security Score: ${score}%`);
  return score;
}

function generateReport(functionalScore, qualityScore, securityScore) {
  log.title();
  log.header('📊 LAUNCH READINESS REPORT');
  console.log('');

  const overallScore = Math.round((functionalScore + qualityScore + securityScore) / 3);

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A', color: colors.green, status: 'Excellent' };
    if (score >= 80) return { grade: 'B', color: colors.green, status: 'Good' };
    if (score >= 70) return { grade: 'C', color: colors.yellow, status: 'Needs Work' };
    if (score >= 60) return { grade: 'D', color: colors.yellow, status: 'Poor' };
    return { grade: 'F', color: colors.red, status: 'Critical Issues' };
  };

  const overall = getGrade(overallScore);
  const functional = getGrade(functionalScore);
  const quality = getGrade(qualityScore);
  const security = getGrade(securityScore);

  console.log(`   ┌─────────────────────────────────────────┐`);
  console.log(`   │  ${colors.bright}OVERALL LAUNCH READINESS${colors.reset}              │`);
  console.log(`   │                                         │`);
  console.log(`   │     ${overall.color}${colors.bright}${overallScore}% - Grade ${overall.grade}${colors.reset}                   │`);
  console.log(`   │     ${overall.color}${overall.status}${colors.reset}                        │`);
  console.log(`   │                                         │`);
  console.log(`   ├─────────────────────────────────────────┤`);
  console.log(`   │  Functional Tests:  ${functional.color}${functionalScore}%${colors.reset} (${functional.grade})            │`);
  console.log(`   │  Quality Audit:     ${quality.color}${qualityScore}%${colors.reset} (${quality.grade})            │`);
  console.log(`   │  Security:          ${security.color}${securityScore}%${colors.reset} (${security.grade})            │`);
  console.log(`   └─────────────────────────────────────────┘`);
  console.log('');

  if (overallScore >= 80) {
    log.success('Your app is ready for launch!');
  } else if (overallScore >= 60) {
    log.warning('Your app needs some improvements before launch.');
  } else {
    log.error('Your app has critical issues that need to be fixed.');
  }

  console.log('\n   Run individual checks for details:');
  console.log('   • npm run test         - Functional tests');
  console.log('   • npm run test:report  - Playwright HTML report');
  console.log('   • npm audit            - Security details');
  console.log('');
}

async function main() {
  console.log(`
${colors.bright}${colors.magenta}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 BrandVoice Studio - Launch Readiness Check              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

  log.info('Starting comprehensive launch check...');
  log.info('This may take a few minutes.\n');

  const functionalScore = await runPlaywright();
  const qualityScore = await runLighthouse();
  const securityScore = await runSecurityAudit();

  generateReport(functionalScore, qualityScore, securityScore);
}

main().catch(console.error);
