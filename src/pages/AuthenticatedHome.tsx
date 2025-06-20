
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

const AuthenticatedHome = () => {
  const { userRole, loading, error, refetch } = useRoleAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    // Message for RLS policy or missing profile errors only
    const isPolicyError =
      error.includes("permissions issue") ||
      error.toLowerCase().includes("policy") ||
      error.toLowerCase().includes("access") ||
      error.toLowerCase().includes("no profile");

    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isPolicyError ? 'text-red-700' : 'text-red-600'}`}>
            <AlertTriangle className="h-5 w-5" />
            Error Loading Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            {isPolicyError ? (
              <>
                {error.includes("no profile") ? (
                  <>
                    No profile found for your user. Your account may not be fully set up yet.
                  </>
                ) : error}
              </>
            ) : (
              error
            )}
          </p>
          <Button onClick={refetch} className="w-full">
            Retry
          </Button>
        </CardContent>
      </Card>
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

export default AuthenticatedHome;
