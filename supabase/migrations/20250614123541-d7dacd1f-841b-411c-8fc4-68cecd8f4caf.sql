
-- First, drop the dependent policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public."Profiles";

-- Now drop the function
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Create the proper security definer function
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

-- Drop any other problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public."Profiles";
DROP POLICY IF EXISTS "Users can update their own profile" ON public."Profiles";
DROP POLICY IF EXISTS "Users can insert their own profile" ON public."Profiles";

-- Create clean policies for Profiles table
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

CREATE POLICY "Admins can view all profiles" 
ON public."Profiles" 
FOR SELECT 
TO authenticated 
USING (public.get_current_user_role() = 'admin');

-- Ensure roles table has proper policy
DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON public.roles;
CREATE POLICY "Allow authenticated users to read roles" 
ON public.roles 
FOR SELECT 
TO authenticated 
USING (true);
