
-- Enable RLS on all tables and create proper policies
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_agent_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Profiles" ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read roles (needed for profile fetching)
CREATE POLICY "Allow authenticated users to read roles" 
ON public.roles 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow all authenticated users to read agents
CREATE POLICY "Allow authenticated users to read agents" 
ON public.agents 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow all authenticated users to read role_agent_access
CREATE POLICY "Allow authenticated users to read role_agent_access" 
ON public.role_agent_access 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow users to read and modify their own profiles
CREATE POLICY "Users can view their own profile" 
ON public."Profiles" 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public."Profiles" 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public."Profiles" 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Allow admins to read all profiles (optional - for admin functionality)
CREATE POLICY "Admins can view all profiles" 
ON public."Profiles" 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public."Profiles" p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.user_id = auth.uid() AND r.name = 'admin'
  )
);
