CREATE TABLE public.event_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.event_chats TO service_role;
ALTER TABLE public.event_chats ENABLE ROW LEVEL SECURITY;
-- No public policies: only the server reads and writes conversations.