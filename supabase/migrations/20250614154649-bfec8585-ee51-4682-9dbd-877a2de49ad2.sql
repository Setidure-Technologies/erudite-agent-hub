
-- Enable RLS for both tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Profiles" ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read roles
DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON public.roles;
CREATE POLICY "Allow authenticated users to read roles"
  ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to read and modify their own profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public."Profiles";
DROP POLICY IF EXISTS "Users can update own profile" ON public."Profiles";
DROP POLICY IF EXISTS "Users can insert own profile" ON public."Profiles";
CREATE POLICY "Users can view own profile"
  ON public."Profiles"
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public."Profiles"
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public."Profiles"
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Security definer admin function to avoid recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN (
    SELECT r.name
    FROM public."Profiles" p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.user_id = auth.uid()
    LIMIT 1
  );
END;
$function$;

-- Policy for admins to see all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public."Profiles";
CREATE POLICY "Admins can view all profiles"
  ON public."Profiles"
  FOR SELECT
  TO authenticated
  USING (public.get_current_user_role() = 'admin');
