-- Migration: Add Dispute, Refund, and Alert models for PayPal webhook handling
-- Date: 2025-12-04
-- Description: Adds support for tracking PayPal disputes, refunds, and admin alerts

-- Add paypalTransactionId to Order table
ALTER TABLE "Order" ADD COLUMN "paypalTransactionId" TEXT;

-- Create index on paypalTransactionId
CREATE INDEX "Order_paypalTransactionId_idx" ON "Order"("paypalTransactionId");
CREATE INDEX "Order_clientId_idx" ON "Order"("clientId");

-- Create Dispute table
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disputeId" TEXT NOT NULL,
    "transactionId" TEXT,
    "orderId" TEXT,
    "clientId" TEXT,
    "amount" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "outcome" TEXT,
    "resolutionType" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "disputeDetails" TEXT NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- Create unique index on disputeId
CREATE UNIQUE INDEX "Dispute_disputeId_key" ON "Dispute"("disputeId");

-- Create indexes for Dispute table
CREATE INDEX "Dispute_disputeId_idx" ON "Dispute"("disputeId");
CREATE INDEX "Dispute_orderId_idx" ON "Dispute"("orderId");
CREATE INDEX "Dispute_clientId_idx" ON "Dispute"("clientId");
CREATE INDEX "Dispute_status_idx" ON "Dispute"("status");

-- Create Refund table
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refundId" TEXT NOT NULL,
    "transactionId" TEXT,
    "orderId" TEXT,
    "clientId" TEXT,
    "amount" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "refundType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "refundedAt" TIMESTAMP(3) NOT NULL,
    "refundDetails" TEXT NOT NULL,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- Create unique index on refundId
CREATE UNIQUE INDEX "Refund_refundId_key" ON "Refund"("refundId");

-- Create indexes for Refund table
CREATE INDEX "Refund_refundId_idx" ON "Refund"("refundId");
CREATE INDEX "Refund_orderId_idx" ON "Refund"("orderId");
CREATE INDEX "Refund_clientId_idx" ON "Refund"("clientId");
CREATE INDEX "Refund_status_idx" ON "Refund"("status");

-- Create Alert table
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "readBy" TEXT,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "resolution" TEXT,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- Create indexes for Alert table
CREATE INDEX "Alert_type_idx" ON "Alert"("type");
CREATE INDEX "Alert_severity_idx" ON "Alert"("severity");
CREATE INDEX "Alert_isRead_idx" ON "Alert"("isRead");
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

-- Add foreign key constraints
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_clientId_fkey"
    FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Refund" ADD CONSTRAINT "Refund_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Refund" ADD CONSTRAINT "Refund_clientId_fkey"
    FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Note: Run this migration using either:
-- 1. Prisma: npx prisma migrate dev --name add_dispute_refund_alert_models
-- 2. Or apply this SQL directly to your database
