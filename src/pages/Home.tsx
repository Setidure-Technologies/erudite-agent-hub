
import { useRoleAccess } from '@/hooks/useRoleAccess';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

const Home = () => {
  const { userRole, loading } = useRoleAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  // Route to appropriate dashboard based on role
  switch (userRole?.name) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
};

export default Home;
