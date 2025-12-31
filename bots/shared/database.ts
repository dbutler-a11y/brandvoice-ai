// BrandVoice Sales Bot - Database Layer
// Simple in-memory + file persistence for leads

import { Lead, Platform, FlowStep, LeadStatus } from './types';
import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(__dirname, '..', 'data', 'leads.json');

// In-memory lead storage
const leads: Map<string, Lead> = new Map();

// Ensure data directory exists
function ensureDataDir(): void {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load leads from file on startup
export function loadLeads(): void {
  ensureDataDir();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      for (const lead of data) {
        // Restore Date objects
        lead.lastMessageAt = new Date(lead.lastMessageAt);
        lead.createdAt = new Date(lead.createdAt);
        lead.updatedAt = new Date(lead.updatedAt);
        if (lead.convertedAt) lead.convertedAt = new Date(lead.convertedAt);
        leads.set(lead.id, lead);
      }
      console.log(`Loaded ${leads.size} leads from storage`);
    }
  } catch (error) {
    console.error('Error loading leads:', error);
  }
}

// Save leads to file
export function saveLeads(): void {
  ensureDataDir();
  try {
    const data = Array.from(leads.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving leads:', error);
  }
}

// Generate unique ID
function generateId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create a composite key for platform + user
function getLeadKey(platform: Platform, oddy: string): string {
  return `${platform}:${oddy}`;
}

// Get or create a lead
export function getOrCreateLead(platform: Platform, oddy: string, username?: string): Lead {
  const key = getLeadKey(platform, oddy);

  // Check if lead exists
  for (const lead of leads.values()) {
    if (lead.platform === platform && lead.oddy === oddy) {
      return lead;
    }
  }

  // Create new lead
  const now = new Date();
  const lead: Lead = {
    id: generateId(),
    oddy,
    platform,
    username,
    currentFlow: null,
    currentStep: 'welcome',
    status: 'new',
    messagesReceived: 0,
    lastMessageAt: now,
    createdAt: now,
    updatedAt: now,
    calendarlyLinkSent: false,
    checkoutLinkSent: false
  };

  leads.set(lead.id, lead);
  saveLeads();

  console.log(`Created new lead: ${lead.id} (${platform}:${username || oddy})`);
  return lead;
}

// Update a lead
export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const lead = leads.get(id);
  if (!lead) return null;

  const updated = {
    ...lead,
    ...updates,
    updatedAt: new Date()
  };

  leads.set(id, updated);
  saveLeads();

  return updated;
}

// Update lead step
export function updateLeadStep(id: string, step: FlowStep): Lead | null {
  return updateLead(id, { currentStep: step });
}

// Increment message count
export function incrementMessageCount(id: string): Lead | null {
  const lead = leads.get(id);
  if (!lead) return null;

  return updateLead(id, {
    messagesReceived: lead.messagesReceived + 1,
    lastMessageAt: new Date()
  });
}

// Get lead by ID
export function getLeadById(id: string): Lead | null {
  return leads.get(id) || null;
}

// Get all leads
export function getAllLeads(): Lead[] {
  return Array.from(leads.values());
}

// Get leads by status
export function getLeadsByStatus(status: LeadStatus): Lead[] {
  return Array.from(leads.values()).filter(lead => lead.status === status);
}

// Get leads by platform
export function getLeadsByPlatform(platform: Platform): Lead[] {
  return Array.from(leads.values()).filter(lead => lead.platform === platform);
}

// Get leads needing follow-up (last message > 24 hours ago, not converted/lost)
export function getLeadsNeedingFollowUp(hoursAgo: number = 24): Lead[] {
  const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

  return Array.from(leads.values()).filter(lead =>
    lead.lastMessageAt < cutoff &&
    lead.status !== 'converted' &&
    lead.status !== 'lost' &&
    lead.status !== 'new'
  );
}

// Mark lead as converted
export function markLeadConverted(id: string, product: Lead['convertedProduct']): Lead | null {
  return updateLead(id, {
    status: 'converted',
    convertedProduct: product,
    convertedAt: new Date()
  });
}

// Mark lead as lost
export function markLeadLost(id: string): Lead | null {
  return updateLead(id, { status: 'lost' });
}

// Get conversion stats
export function getStats(): {
  total: number;
  byStatus: Record<LeadStatus, number>;
  byPlatform: Record<Platform, number>;
  conversions: number;
  conversionRate: number;
} {
  const allLeads = Array.from(leads.values());

  const byStatus: Record<LeadStatus, number> = {
    new: 0,
    engaged: 0,
    qualified: 0,
    calendly_sent: 0,
    call_booked: 0,
    checkout_sent: 0,
    converted: 0,
    lost: 0
  };

  const byPlatform: Record<Platform, number> = {
    telegram: 0,
    discord: 0
  };

  for (const lead of allLeads) {
    byStatus[lead.status]++;
    byPlatform[lead.platform]++;
  }

  const conversions = byStatus.converted;
  const qualified = allLeads.filter(l => l.status !== 'new').length;

  return {
    total: allLeads.length,
    byStatus,
    byPlatform,
    conversions,
    conversionRate: qualified > 0 ? (conversions / qualified) * 100 : 0
  };
}

// Export for analytics
export function exportLeadsCSV(): string {
  const allLeads = Array.from(leads.values());

  const headers = [
    'ID',
    'Platform',
    'Username',
    'Status',
    'Current Flow',
    'Industry',
    'Messages',
    'Created',
    'Last Message',
    'Calendly Sent',
    'Checkout Sent',
    'Converted'
  ];

  const rows = allLeads.map(lead => [
    lead.id,
    lead.platform,
    lead.username || lead.oddy,
    lead.status,
    lead.currentFlow || '',
    lead.industry || '',
    lead.messagesReceived.toString(),
    lead.createdAt.toISOString(),
    lead.lastMessageAt.toISOString(),
    lead.calendarlyLinkSent ? 'Yes' : 'No',
    lead.checkoutLinkSent ? 'Yes' : 'No',
    lead.convertedAt?.toISOString() || ''
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// Initialize on import
loadLeads();
