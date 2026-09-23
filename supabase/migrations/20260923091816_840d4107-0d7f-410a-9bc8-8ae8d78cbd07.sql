ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS customer_message text,
  ADD COLUMN IF NOT EXISTS booking_source text NOT NULL DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS confirmed_at timestamp with time zone;

CREATE SEQUENCE IF NOT EXISTS public.booking_reference_seq START WITH 1024;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS booking_reference text;

UPDATE public.bookings
  SET booking_reference = 'AYR-' || nextval('public.booking_reference_seq')::text
  WHERE booking_reference IS NULL;

ALTER TABLE public.bookings
  ALTER COLUMN booking_reference SET DEFAULT ('AYR-' || nextval('public.booking_reference_seq')::text);

ALTER TABLE public.bookings
  ALTER COLUMN booking_reference SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_reference_key ON public.bookings (booking_reference);

CREATE UNIQUE INDEX IF NOT EXISTS bookings_slot_unique
  ON public.bookings (booking_date, time_slot)
  WHERE status <> 'cancelled';