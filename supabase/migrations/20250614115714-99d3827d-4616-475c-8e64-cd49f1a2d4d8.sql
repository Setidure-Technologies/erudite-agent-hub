
-- First, drop the problematic admin policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public."Profiles";

-- Create a security definer function to get user role without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT r.name 
    FROM public."Profiles" p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create a better admin policy using the security definer function
CREATE POLICY "Admins can view all profiles" 
ON public."Profiles" 
FOR SELECT 
TO authenticated 
USING (public.get_current_user_role() = 'admin');

-- Add missing teacher role if it doesn't exist
INSERT INTO public.roles (name, description) 
SELECT 'teacher', 'Teacher role with access to teaching tools and student management'
WHERE NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'teacher');

-- Add missing student role if it doesn't exist  
INSERT INTO public.roles (name, description) 
SELECT 'student', 'Student role with access to learning tools'
WHERE NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'student');

-- Add missing admin role if it doesn't exist
INSERT INTO public.roles (name, description) 
SELECT 'admin', 'Admin role with full access to all features'
WHERE NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'admin');

-- Add unique constraint to agents table for route
ALTER TABLE public.agents 
ADD CONSTRAINT agents_route_unique 
UNIQUE (route);

-- Add unique constraint to role_agent_access table
ALTER TABLE public.role_agent_access 
ADD CONSTRAINT role_agent_access_unique 
UNIQUE (role_id, agent_id);

-- Ensure all agents exist with correct routes
INSERT INTO public.agents (name, description, route, icon, is_active) VALUES
('Profile Management', 'Manage your profile information', '/profile', 'User', true),
('Upload Resume', 'Upload and manage your resume', '/upload-resume', 'Upload', true),
('Skill Gap Analysis', 'Analyze your skill gaps', '/analyze-skill-gap', 'BarChart3', true),
('Job Recommendations', 'Get personalized job recommendations', '/recommend-jobs', 'Briefcase', true),
('Interview Coach', 'Practice interviews with AI', '/interview-coach', 'Target', true),
('Voice Training', 'Improve your communication skills', '/voice-training', 'BookOpen', true),
('Admin Panel', 'Administrative functions', '/admin', 'Settings', true),
('Test Webhook', 'Test webhook functionality', '/test-webhook', 'Settings', true)
ON CONFLICT (route) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;

-- Clear existing role_agent_access data to avoid conflicts
DELETE FROM public.role_agent_access;

-- Grant access to students for relevant agents
INSERT INTO public.role_agent_access (role_id, agent_id, can_access)
SELECT 
  r.id,
  a.id,
  true
FROM public.roles r
CROSS JOIN public.agents a
WHERE r.name = 'student' 
  AND a.route IN ('/profile', '/upload-resume', '/analyze-skill-gap', '/recommend-jobs', '/interview-coach', '/voice-training');

-- Grant access to teachers for teaching-related agents
INSERT INTO public.role_agent_access (role_id, agent_id, can_access)
SELECT 
  r.id,
  a.id,
  true
FROM public.roles r
CROSS JOIN public.agents a
WHERE r.name = 'teacher' 
  AND a.route IN ('/profile', '/voice-training', '/admin');

-- Grant access to admin for all agents
INSERT INTO public.role_agent_access (role_id, agent_id, can_access)
SELECT 
  r.id,
  a.id,
  true
FROM public.roles r
CROSS JOIN public.agents a
WHERE r.name = 'admin';
