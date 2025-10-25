-- Fix search_path for handle_new_user function (from users table trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (user_id, email, created_at, updated_at, account_status)
  VALUES (
    NEW.id, 
    NEW.email, 
    NOW(), 
    NOW(),
    'active'
  );
  RETURN NEW;
END;
$$;