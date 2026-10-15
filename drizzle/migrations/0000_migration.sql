CREATE TABLE public.ticket_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_date date NOT NULL,
  parent_name text NOT NULL CHECK (char_length(parent_name) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 30),
  email text CHECK (email IS NULL OR char_length(email) <= 255),
  ticket_type text NOT NULL CHECK (ticket_type IN ('early_bird','standard')),
  children int NOT NULL CHECK (children BETWEEN 1 AND 10),
  under_twos int NOT NULL DEFAULT 0 CHECK (under_twos BETWEEN 0 AND 10),
  estimated_total numeric NOT NULL CHECK (estimated_total >= 0 AND estimated_total < 10000),
  notes text CHECK (notes IS NULL OR char_length(notes) <= 500)
);
GRANT INSERT ON public.ticket_bookings TO anon, authenticated;
GRANT ALL ON public.ticket_bookings TO service_role;
ALTER TABLE public.ticket_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request a booking" ON public.ticket_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);