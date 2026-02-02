-- Create message_replies table
CREATE TABLE IF NOT EXISTS message_replies (
  id BIGSERIAL PRIMARY KEY,
  original_message_id BIGINT REFERENCES contact_messages(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_from TEXT,
  email_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_message_replies_original_message_id ON message_replies(original_message_id);
CREATE INDEX IF NOT EXISTS idx_message_replies_recipient_email ON message_replies(recipient_email);

-- Add RLS policies for message_replies table
ALTER TABLE message_replies ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to read their own message replies (by email)
CREATE POLICY "Users can view their own message replies" 
  ON message_replies 
  FOR SELECT 
  USING (
    recipient_email = auth.jwt() ->> 'email' OR 
    auth.role() = 'authenticated'
  );

-- Policy: Allow service role (admin) to insert message replies
CREATE POLICY "Admin can create message replies" 
  ON message_replies 
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Allow service role to update message replies
CREATE POLICY "Admin can update message replies" 
  ON message_replies 
  FOR UPDATE 
  USING (auth.role() = 'service_role');

-- Grant permissions to authenticated users
GRANT SELECT ON message_replies TO authenticated;
GRANT INSERT, UPDATE ON message_replies TO service_role;
