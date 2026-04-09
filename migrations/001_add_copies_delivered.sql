-- Add copies_delivered column to orders table for partial delivery tracking
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

ALTER TABLE orders ADD COLUMN IF NOT EXISTS copies_delivered integer DEFAULT 0;

-- Add a comment for documentation
COMMENT ON COLUMN orders.copies_delivered IS 'Number of copies delivered so far (for partial delivery tracking)';
