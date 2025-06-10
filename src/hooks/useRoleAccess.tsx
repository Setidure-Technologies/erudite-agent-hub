
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Agent {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  is_active: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role_id: string;
  role: Role;
  // All the student data fields with correct names from database
  'date of birth in mm/dd/yyyy format': string;
  'gender of the student': string;
  'current age of the student': number;
  'education board for class 10': string;
  'name of the school attended for class 10': string;
  'percentage marks scored in class 10': number;
  'year when class 10 was completed': number;
  'academic stream chosen in class 12': string;
  'education board for class 12': string;
  'name of the school attended for class 12': string;
  'percentage marks scored in class 12': number;
  'year when class 12 was completed': number;
  'type of degree obtained during graduation': string;
  'specialization pursued during graduation': string;
  'name of the university attended for graduation': string;
  'name of the college attended for graduation': string;
  'percentage marks obtained during graduation': number;
  'year when graduation was completed': number;
  'cgpa during mba program': number;
  'projects or research work done during mba': string;
  'technical skills of the student': string;
  'interpersonal or soft skills of the student': string;
  'total work experience of the student in months': string;
  'does the student have any prior work experience': string;
  'name of the first organization worked at': string;
  'job title or designation at first organization': string;
  'domain or function at first organization': string;
  'industry of the first organization': string;
  'duration of work experience at first organization in months': string;
  'name of the second organization worked at': string;
  'job title or designation at second organization': string;
  'domain or function at second organization': string;
  'industry of the second organization': string;
  'duration of work experience at second organization in months': string;
  'name of the third organization worked at': string;
  'job title or designation at third organization': string;
  'domain or function at third organization': string;
  'industry of the third organization': string;
  'duration of work experience at third organization in months': string;
  'Languages the student can speak, understand, or is proficient i': string;
  'First area of academic or professional specialization of the st': string;
  'Second area of academic or professional specialization of the s': string;
  'Desired job role or long-term career goal of the student': string;
  'Role or profile undertaken by the student during their summer i': string;
  'Name of the organization where the student completed their summ': string;
  'did the student have any gaps in academic career': string;
  'duration of academic gap in months': string;
  resume_url: string;
  resume_parsed_data: any;
  Roll_Number: string;
}

export const useRoleAccess = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [accessibleAgents, setAccessibleAgents] = useState<Agent[]>([]);
  const [allStudents, setAllStudents] = useState<UserProfile[]>([]);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRoleAndAgents();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserRoleAndAgents = async () => {
    try {
      setError(null);
      
      // Get user's complete profile with role
      const { data: profileData, error: profileError } = await supabase
        .from('Profiles')
        .select(`
          *,
          role:roles(id, name, description)
        `)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        setError('Failed to fetch user profile');
        return;
      }

      const role = profileData?.role;
      setUserRole(role);
      setUserProfile(profileData);

      if (role) {
        // Get accessible agents for this role
        const { data: agentAccessData, error: agentError } = await supabase
          .from('role_agent_access')
          .select(`
            agent:agents(id, name, description, route, icon, is_active)
          `)
          .eq('role_id', role.id)
          .eq('can_access', true);

        if (agentError) {
          console.error('Agent access error:', agentError);
        } else {
          const agents = agentAccessData
            ?.map(item => item.agent)
            .filter(agent => agent && agent.is_active) || [];
          setAccessibleAgents(agents);
        }

        // If admin or teacher, fetch additional data
        if (role.name === 'admin' || role.name === 'teacher') {
          await fetchAdditionalData();
        }
      }
    } catch (error) {
      console.error('Error fetching user role and agents:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalData = async () => {
    try {
      // Fetch all students for admin/teacher view
      const { data: studentsData, error: studentsError } = await supabase
        .from('Profiles')
        .select(`
          *,
          role:roles(id, name, description)
        `)
        .order('created_at', { ascending: false });

      if (studentsError) {
        console.error('Students fetch error:', studentsError);
      } else {
        setAllStudents(studentsData || []);
      }

      // Fetch all VaakShakti sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('vaakshakti_sessions')
        .select(`
          *,
          feedback:vaakshakti_feedback(*)
        `)
        .order('created_at', { ascending: false });

      if (sessionsError) {
        console.error('Sessions fetch error:', sessionsError);
      } else {
        setAllSessions(sessionsData || []);
      }

    } catch (error) {
      console.error('Error fetching additional data:', error);
    }
  };

  const hasAccess = (agentRoute: string) => {
    return accessibleAgents.some(agent => agent.route === agentRoute);
  };

  const isAdmin = () => {
    return userRole?.name === 'admin';
  };

  const isTeacher = () => {
    return userRole?.name === 'teacher';
  };

  const isStudent = () => {
    return userRole?.name === 'student';
  };

  return {
    userProfile,
    userRole,
    accessibleAgents,
    allStudents,
    allSessions,
    loading,
    error,
    hasAccess,
    isAdmin,
    isTeacher,
    isStudent,
    refetch: fetchUserRoleAndAgents
  };
};
