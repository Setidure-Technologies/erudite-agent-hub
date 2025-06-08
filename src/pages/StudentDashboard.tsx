
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { GraduationCap, Users, BookOpen, Target } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { accessibleAgents, allSessions } = useRoleAccess();

  const userSessions = allSessions.filter(session => session.user_id === user?.id);
  const avgScore = userSessions.length > 0 
    ? Math.round(userSessions.reduce((acc, session) => acc + (session.fluency_score || 0), 0) / userSessions.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-blue-100">Welcome back! Continue your learning journey</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessibleAgents.length}</div>
            <p className="text-xs text-muted-foreground">
              AI assistants ready to help
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              Voice training completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}%</div>
            <p className="text-xs text-muted-foreground">
              Your performance average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2" asChild>
              <a href="/voice-training">
                <BookOpen className="h-6 w-6" />
                Voice Training
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <a href="/profile">
                <Users className="h-6 w-6" />
                Update Profile
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <a href="/upload-resume">
                <Target className="h-6 w-6" />
                Upload Resume
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <a href="/analyze-skill-gap">
                <GraduationCap className="h-6 w-6" />
                Skill Analysis
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Voice Training Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {userSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No training sessions yet. Start your first session!</p>
          ) : (
            <div className="space-y-4">
              {userSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{session.question}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {session.fluency_score && (
                      <Badge variant={session.fluency_score >= 80 ? 'default' : session.fluency_score >= 60 ? 'secondary' : 'destructive'}>
                        {session.fluency_score}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
