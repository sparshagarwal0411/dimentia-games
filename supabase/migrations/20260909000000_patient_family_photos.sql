-- Store compressed JPEG data URLs for patient and family photos.
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS patient_photo TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS caregiver_photo TEXT NOT NULL DEFAULT '';
