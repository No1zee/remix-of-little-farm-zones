ALTER TABLE public.ticket_bookings ADD COLUMN IF NOT EXISTS ecocash_reference text, ADD COLUMN IF NOT EXISTS ecocash_payer_number text;
COMMENT ON COLUMN public.ticket_bookings.paynow_reference IS 'Reserved for a future Paynow integration';
CREATE OR REPLACE FUNCTION public.ticket_bookings_guard_payment() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF current_user IN ('anon','authenticated') THEN
    NEW.paid_at := NULL; NEW.paynow_reference := NULL; NEW.paynow_poll_url := NULL;
    IF NEW.payment_method = 'ecocash' AND coalesce(trim(NEW.ecocash_reference),'') <> '' THEN
      NEW.payment_status := 'awaiting_check';
    ELSE
      NEW.payment_method := 'pay_later'; NEW.payment_status := 'unpaid';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER ticket_bookings_guard_payment BEFORE INSERT ON public.ticket_bookings FOR EACH ROW EXECUTE FUNCTION public.ticket_bookings_guard_payment();