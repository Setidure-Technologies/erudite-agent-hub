
-- First, let's ensure we have the necessary roles (using WHERE NOT EXISTS to avoid duplicates)
INSERT INTO public.roles (name, description) 
SELECT 'student', 'Student role with access to learning tools'
WHERE NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'student');

INSERT INTO public.roles (name, description) 
SELECT 'admin', 'Administrator role with full access'
WHERE NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'admin');

-- Set up agents (using WHERE NOT EXISTS to avoid duplicates)
INSERT INTO public.agents (name, description, route, icon, is_active) 
SELECT 'Profile Management', 'Manage your profile information', '/profile', 'User', true
WHERE NOT EXISTS (SELECT 1 FROM public.agents WHERE route = '/profile');

INSERT INTO public.agents (name, description, route, icon, is_active) 
SELECT 'Upload Resume', 'Upload and manage your resume', '/upload-resume', 'Upload', true
WHERE NOT EXISTS (SELECT 1 FROM public.agents WHERE route = '/upload-resume');

INSERT INTO public.agents (name, description, route, icon, is_active) 
SELECT 'Skill Gap Analysis', 'Analyze your skill gaps', '/analyze-skill-gap', 'BarChart3', true
WHERE NOT EXISTS (SELECT 1 FROM public.agents WHERE route = '/analyze-skill-gap');

INSERT INTO public.agents (name, description, route, icon, is_active) 
SELECT 'Job Recommendations', 'Get personalized job recommendations', '/recommend-jobs', 'Briefcase', true
WHERE NOT EXISTS (SELECT 1 FROM public.agents WHERE route = '/recommend-jobs');

INSERT INTO public.agents (name, description, route, icon, is_active) 
SELECT 'Interview Coach', 'Practice interviews with AI', '/interview-coach', 'Target', true
WHERE NOT EXISTS (SELECT 1 FROM public.agents WHERE route = '/interview-coach');

INSERT INTO public.agents (name, description, route, icon, is_active) 
SELECT 'Voice Training', 'Improve your communication skills', '/voice-training', 'BookOpen', true
WHERE NOT EXISTS (SELECT 1 FROM public.agents WHERE route = '/voice-training');

INSERT INTO public.agents (name, description, route, icon, is_active) 
SELECT 'Admin Panel', 'Administrative functions', '/admin', 'Settings', true
WHERE NOT EXISTS (SELECT 1 FROM public.agents WHERE route = '/admin');

-- Grant access to students for relevant agents
INSERT INTO public.role_agent_access (role_id, agent_id, can_access)
SELECT 
  r.id,
  a.id,
  true
FROM public.roles r
CROSS JOIN public.agents a
WHERE r.name = 'student' 
  AND a.route IN ('/profile', '/upload-resume', '/analyze-skill-gap', '/recommend-jobs', '/interview-coach', '/voice-training')
  AND NOT EXISTS (
    SELECT 1 FROM public.role_agent_access raa 
    WHERE raa.role_id = r.id AND raa.agent_id = a.id
  );

-- Grant access to admin for all agents
INSERT INTO public.role_agent_access (role_id, agent_id, can_access)
SELECT 
  r.id,
  a.id,
  true
FROM public.roles r
CROSS JOIN public.agents a
WHERE r.name = 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM public.role_agent_access raa 
    WHERE raa.role_id = r.id AND raa.agent_id = a.id
  );
