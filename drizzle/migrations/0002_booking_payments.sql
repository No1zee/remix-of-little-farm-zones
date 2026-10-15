ALTER TABLE public.ticket_bookings
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS paynow_reference text,
  ADD COLUMN IF NOT EXISTS paynow_poll_url text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;
GRANT ALL ON public.ticket_bookings TO service_role;