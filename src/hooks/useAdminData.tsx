
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const useAdminData = (userRole: string | undefined) => {
  const [allStudents, setAllStudents] = useState<UserProfile[]>([]);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    if (!userRole || (userRole !== 'admin' && userRole !== 'teacher')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

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
        setError('Failed to fetch students data');
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
        setError('Failed to fetch sessions data');
      } else {
        setAllSessions(sessionsData || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [userRole]);

  return {
    allStudents,
    allSessions,
    loading,
    error,
    refetch: fetchAdminData
  };
};
