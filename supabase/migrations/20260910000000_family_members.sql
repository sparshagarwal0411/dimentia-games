-- Store array of family members with photos, names, and relations
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS family_members JSONB DEFAULT '[]'::jsonb;
