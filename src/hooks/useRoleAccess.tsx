
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAgentAccess } from '@/hooks/useAgentAccess';
import { useAdminData } from '@/hooks/useAdminData';

export const useRoleAccess = () => {
  const { userProfile, userRole, loading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfile();
  const { accessibleAgents, hasAccess, loading: agentLoading, error: agentError, refetch: refetchAgents } = useAgentAccess(userRole);
  const { allStudents, allSessions, loading: adminLoading, error: adminError, refetch: refetchAdmin } = useAdminData(userRole?.name);

  const isAdmin = () => {
    return userRole?.name === 'admin';
  };

  const isTeacher = () => {
    return userRole?.name === 'teacher';
  };

  const isStudent = () => {
    return userRole?.name === 'student';
  };

  const refetch = async () => {
    await refetchProfile();
    await refetchAgents();
    await refetchAdmin();
  };

  return {
    userProfile,
    userRole,
    accessibleAgents,
    allStudents,
    allSessions,
    loading: profileLoading || agentLoading || adminLoading,
    error: profileError || agentError || adminError,
    hasAccess,
    isAdmin,
    isTeacher,
    isStudent,
    refetch
  };
};
