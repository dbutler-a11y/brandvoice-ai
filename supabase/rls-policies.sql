-- Row Level Security Policies for AI Spokesperson Studio
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Client" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClientUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClientAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Script" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Intake" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Spokesperson" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER TABLE POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON "User"
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON "User"
  FOR UPDATE USING (auth.uid()::text = id::text);

-- ============================================
-- CLIENT TABLE POLICIES
-- ============================================

-- Clients can only view their linked client records
CREATE POLICY "Clients view their own client records" ON "Client"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "ClientUser" 
      WHERE "ClientUser"."clientId" = "Client".id 
      AND "ClientUser"."userId"::text = auth.uid()::text
    )
  );

-- Admins can view all clients
CREATE POLICY "Admins view all clients" ON "Client"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id::text = auth.uid()::text 
      AND "User".role = 'ADMIN'
    )
  );

-- Admins can insert/update/delete clients
CREATE POLICY "Admins manage clients" ON "Client"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id::text = auth.uid()::text 
      AND "User".role = 'ADMIN'
    )
  );

-- ============================================
-- CLIENT ASSETS POLICIES
-- ============================================

-- Clients can view their own assets
CREATE POLICY "Clients view own assets" ON "ClientAsset"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "ClientUser" 
      WHERE "ClientUser"."clientId" = "ClientAsset"."clientId"
      AND "ClientUser"."userId"::text = auth.uid()::text
    )
  );

-- Admins can manage all assets
CREATE POLICY "Admins manage all assets" ON "ClientAsset"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id::text = auth.uid()::text 
      AND "User".role = 'ADMIN'
    )
  );

-- ============================================
-- SCRIPTS POLICIES
-- ============================================

-- Clients can view their own scripts
CREATE POLICY "Clients view own scripts" ON "Script"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "ClientUser" 
      WHERE "ClientUser"."clientId" = "Script"."clientId"
      AND "ClientUser"."userId"::text = auth.uid()::text
    )
  );

-- Admins can manage all scripts
CREATE POLICY "Admins manage all scripts" ON "Script"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id::text = auth.uid()::text 
      AND "User".role = 'ADMIN'
    )
  );

-- ============================================
-- INTAKE POLICIES
-- ============================================

-- Clients can view their own intake
CREATE POLICY "Clients view own intake" ON "Intake"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "ClientUser" 
      WHERE "ClientUser"."clientId" = "Intake"."clientId"
      AND "ClientUser"."userId"::text = auth.uid()::text
    )
  );

-- Admins can manage all intakes
CREATE POLICY "Admins manage all intakes" ON "Intake"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id::text = auth.uid()::text 
      AND "User".role = 'ADMIN'
    )
  );

-- ============================================
-- SPOKESPERSON POLICIES (Public read)
-- ============================================

-- Everyone can view available spokespersons
CREATE POLICY "Anyone can view spokespersons" ON "Spokesperson"
  FOR SELECT USING (true);

-- Only admins can manage spokespersons
CREATE POLICY "Admins manage spokespersons" ON "Spokesperson"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id::text = auth.uid()::text 
      AND "User".role = 'ADMIN'
    )
  );

-- ============================================
-- CLIENT USER JUNCTION POLICIES
-- ============================================

-- Users can see their own client links
CREATE POLICY "Users view own client links" ON "ClientUser"
  FOR SELECT USING (auth.uid()::text = "userId"::text);

-- Admins can manage all client-user links
CREATE POLICY "Admins manage client links" ON "ClientUser"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id::text = auth.uid()::text 
      AND "User".role = 'ADMIN'
    )
  );
