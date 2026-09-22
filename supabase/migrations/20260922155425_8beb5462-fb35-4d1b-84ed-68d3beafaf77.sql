DROP POLICY "Admins can view bookings" ON public.bookings;
DROP POLICY "Admins can update bookings" ON public.bookings;
DROP POLICY "Admins can delete bookings" ON public.bookings;

CREATE POLICY "Admins can view bookings" ON public.bookings
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
  );

CREATE POLICY "Admins can update bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
  );

CREATE POLICY "Admins can delete bookings" ON public.bookings
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
  );

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM anon;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM authenticated;