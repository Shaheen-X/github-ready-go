-- Drop the redundant users table
-- We're keeping the profiles table which is the standard Supabase pattern
-- The profiles table already has all necessary user data and is properly linked to auth.users

DROP TABLE IF EXISTS public.users CASCADE;

-- Ensure profiles table has email for easier access
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email text;

-- Update existing profiles with email from auth.users if needed
-- This is a one-time sync (will only update null emails)
CREATE OR REPLACE FUNCTION sync_profile_email()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles p
  SET email = au.email
  FROM auth.users au
  WHERE p.id = au.id
  AND p.email IS NULL;
END;
$$;

SELECT sync_profile_email();

-- Update the handle_new_user_profile trigger function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, email, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$function$;