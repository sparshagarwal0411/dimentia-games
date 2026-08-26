REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP POLICY "attempts by owner" ON public.game_attempts;
CREATE POLICY "attempts by owner" ON public.game_attempts FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()));

DROP POLICY "cog by owner" ON public.cognitive_profiles;
CREATE POLICY "cog by owner" ON public.cognitive_profiles FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()));

DROP POLICY "reminders by owner" ON public.reminders;
CREATE POLICY "reminders by owner" ON public.reminders FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()));

DROP POLICY "prefs by owner" ON public.accessibility_preferences;
CREATE POLICY "prefs by owner" ON public.accessibility_preferences FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()));

DROP POLICY "challenges by owner" ON public.family_challenges;
CREATE POLICY "challenges by owner" ON public.family_challenges FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()));

DROP POLICY "moods by owner" ON public.mood_logs;
CREATE POLICY "moods by owner" ON public.mood_logs FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.caregiver_id = auth.uid()));

DROP FUNCTION IF EXISTS public.owns_patient(UUID);