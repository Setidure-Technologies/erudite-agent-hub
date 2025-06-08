
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { BookOpen, Users, TrendingUp, Settings } from 'lucide-react';

const TeacherDashboard = () => {
  const { allStudents, allSessions, accessibleAgents } = useRoleAccess();

  const students = allStudents.filter(s => s.role?.name === 'student');
  const avgScore = allSessions.length > 0 
    ? Math.round(allSessions.reduce((acc, session) => acc + (session.fluency_score || 0), 0) / allSessions.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-green-100">Monitor student progress and manage learning activities</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allSessions.length}</div>
            <p className="text-xs text-muted-foreground">Total completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}%</div>
            <p className="text-xs text-muted-foreground">Class performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessibleAgents.length}</div>
            <p className="text-xs text-muted-foreground">Available tools</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Student Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.slice(0, 10).map((student) => {
              const studentSessions = allSessions.filter(s => s.user_id === student.user_id);
              const studentAvg = studentSessions.length > 0 
                ? Math.round(studentSessions.reduce((acc, session) => acc + (session.fluency_score || 0), 0) / studentSessions.length)
                : 0;
              
              return (
                <div key={student.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{student.name || 'No name'}</h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                    <p className="text-xs text-gray-400">Sessions: {studentSessions.length}</p>
                  </div>
                  <div className="text-right">
                    {studentAvg > 0 ? (
                      <Badge variant={studentAvg >= 80 ? 'default' : studentAvg >= 60 ? 'secondary' : 'destructive'}>
                        {studentAvg}% avg
                      </Badge>
                    ) : (
                      <Badge variant="outline">No sessions</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col gap-2" asChild>
              <a href="/admin-dashboard">
                <Users className="h-6 w-6" />
                View All Students
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <a href="/voice-training">
                <BookOpen className="h-6 w-6" />
                Voice Training Demo
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <a href="/profile">
                <Settings className="h-6 w-6" />
                Update Profile
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
