-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'caregiver',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- patients
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INT NOT NULL DEFAULT 70,
  language TEXT NOT NULL DEFAULT 'en',
  region TEXT NOT NULL DEFAULT 'Assam',
  elder_mode BOOLEAN NOT NULL DEFAULT true,
  base_difficulty INT NOT NULL DEFAULT 2,
  avatar_emoji TEXT NOT NULL DEFAULT '🧑',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.patients TO authenticated;
GRANT ALL ON public.patients TO service_role;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "caregiver patients" ON public.patients FOR ALL TO authenticated
USING (caregiver_id = auth.uid()) WITH CHECK (caregiver_id = auth.uid());

CREATE OR REPLACE FUNCTION public.owns_patient(_patient_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.patients p WHERE p.id = _patient_id AND p.caregiver_id = auth.uid());
$$;

-- games (shared reference data)
CREATE TABLE public.games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🎮',
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.games TO anon, authenticated;
GRANT ALL ON public.games TO service_role;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "games readable" ON public.games FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.games (id, name, category, description, icon, sort_order) VALUES
('memory-match','Memory Match','memory','Look at everyday objects, then remember which ones you saw.','🍎',1),
('pattern-recognition','Pattern Play','pattern','Find what comes next in a simple pattern of shapes and colours.','🔵',2),
('routine-recall','My Day Order','recall','Put the steps of your daily routine back in the right order.','🌅',3),
('object-recognition','Familiar Things','attention','Spot the familiar object you saw a moment ago.','🫖',4),
('emotion-recognition','How Do They Feel','emotion','Look at a face and choose the feeling that matches.','😊',5);

-- game attempts
CREATE TABLE public.game_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  difficulty INT NOT NULL DEFAULT 1,
  score INT NOT NULL DEFAULT 0,
  accuracy NUMERIC NOT NULL DEFAULT 0,
  response_time NUMERIC NOT NULL DEFAULT 0,
  mistakes INT NOT NULL DEFAULT 0,
  synced BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX game_attempts_patient_idx ON public.game_attempts (patient_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_attempts TO authenticated;
GRANT ALL ON public.game_attempts TO service_role;
ALTER TABLE public.game_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attempts by owner" ON public.game_attempts FOR ALL TO authenticated
USING (public.owns_patient(patient_id)) WITH CHECK (public.owns_patient(patient_id));

-- cognitive profiles
CREATE TABLE public.cognitive_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  level INT NOT NULL DEFAULT 2,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (patient_id, domain)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cognitive_profiles TO authenticated;
GRANT ALL ON public.cognitive_profiles TO service_role;
ALTER TABLE public.cognitive_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cog by owner" ON public.cognitive_profiles FOR ALL TO authenticated
USING (public.owns_patient(patient_id)) WITH CHECK (public.owns_patient(patient_id));

-- reminders
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'medicine',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL DEFAULT '08:00',
  frequency TEXT NOT NULL DEFAULT 'daily',
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO authenticated;
GRANT ALL ON public.reminders TO service_role;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reminders by owner" ON public.reminders FOR ALL TO authenticated
USING (public.owns_patient(patient_id)) WITH CHECK (public.owns_patient(patient_id));

-- accessibility preferences
CREATE TABLE public.accessibility_preferences (
  patient_id UUID PRIMARY KEY REFERENCES public.patients(id) ON DELETE CASCADE,
  text_scale NUMERIC NOT NULL DEFAULT 1,
  high_contrast BOOLEAN NOT NULL DEFAULT false,
  large_buttons BOOLEAN NOT NULL DEFAULT true,
  voice_guidance BOOLEAN NOT NULL DEFAULT true,
  slow_mode BOOLEAN NOT NULL DEFAULT false,
  reduce_sounds BOOLEAN NOT NULL DEFAULT false,
  dark_mode BOOLEAN NOT NULL DEFAULT false,
  simplify BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accessibility_preferences TO authenticated;
GRANT ALL ON public.accessibility_preferences TO service_role;
ALTER TABLE public.accessibility_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prefs by owner" ON public.accessibility_preferences FOR ALL TO authenticated
USING (public.owns_patient(patient_id)) WITH CHECK (public.owns_patient(patient_id));

-- family challenges
CREATE TABLE public.family_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  creator_name TEXT NOT NULL DEFAULT 'Family',
  game_id TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  creator_score INT,
  patient_score INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_challenges TO authenticated;
GRANT ALL ON public.family_challenges TO service_role;
ALTER TABLE public.family_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "challenges by owner" ON public.family_challenges FOR ALL TO authenticated
USING (public.owns_patient(patient_id)) WITH CHECK (public.owns_patient(patient_id));

-- mood logs
CREATE TABLE public.mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mood_logs TO authenticated;
GRANT ALL ON public.mood_logs TO service_role;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "moods by owner" ON public.mood_logs FOR ALL TO authenticated
USING (public.owns_patient(patient_id)) WITH CHECK (public.owns_patient(patient_id));

-- cultural content
CREATE TABLE public.cultural_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🧺',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
GRANT SELECT ON public.cultural_content TO anon, authenticated;
GRANT ALL ON public.cultural_content TO service_role;
ALTER TABLE public.cultural_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cultural readable" ON public.cultural_content FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.cultural_content (region, category, title, emoji) VALUES
('Assam','food','Rice plate','🍚'),('Assam','food','Tea cup','🍵'),('Assam','household','Brass water pot','🏺'),
('Assam','clothing','Woven shawl','🧣'),('Assam','nature','Bamboo grove','🎍'),('Assam','everyday','Hand fan','🪭'),
('Meghalaya','food','Steamed rice cake','🍥'),('Meghalaya','nature','Living root bridge','🌉'),('Meghalaya','household','Bamboo basket','🧺'),
('Meghalaya','clothing','Shoulder wrap','🧥'),('Meghalaya','nature','Rain cloud','🌧️'),('Meghalaya','everyday','Umbrella','☂️'),
('Manipur','food','Fish curry','🐟'),('Manipur','household','Clay pot','🫙'),('Manipur','nature','Floating lake','🛶'),
('Manipur','clothing','Wrap skirt','👗'),('Manipur','everyday','Hand drum','🪘'),('Manipur','nature','Lotus','🪷'),
('Mizoram','food','Bamboo shoot','🎍'),('Mizoram','household','Wooden mortar','🪵'),('Mizoram','nature','Hill slope','⛰️'),
('Mizoram','clothing','Striped cloth','🧶'),('Mizoram','everyday','Basket hat','👒'),('Mizoram','food','Boiled greens','🥬'),
('Nagaland','food','Roasted corn','🌽'),('Nagaland','household','Log drum','🪘'),('Nagaland','nature','Hornbill','🦜'),
('Nagaland','clothing','Beaded necklace','📿'),('Nagaland','everyday','Cane stool','🪑'),('Nagaland','nature','Pine tree','🌲'),
('Tripura','food','Pineapple','🍍'),('Tripura','household','Bamboo mat','🧺'),('Tripura','nature','Rubber tree','🌳'),
('Tripura','clothing','Handloom cloth','🧵'),('Tripura','everyday','Water jug','🫗'),('Tripura','food','Rice beer bowl','🥣'),
('Arunachal Pradesh','food','Millet bowl','🥣'),('Arunachal Pradesh','nature','Snow peak','🏔️'),('Arunachal Pradesh','household','Fire hearth','🔥'),
('Arunachal Pradesh','clothing','Woollen coat','🧥'),('Arunachal Pradesh','everyday','Walking stick','🦯'),('Arunachal Pradesh','nature','Orchid','🌺'),
('Sikkim','food','Steamed dumpling','🥟'),('Sikkim','nature','Mountain view','🏔️'),('Sikkim','household','Butter tea churn','🫖'),
('Sikkim','clothing','Prayer scarf','🧣'),('Sikkim','everyday','Prayer wheel','☸️'),('Sikkim','nature','Yak','🐂');