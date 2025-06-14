
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Settings, Users, BarChart3, Upload, Shield, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { allStudents, allSessions, accessibleAgents } = useRoleAccess();

  const students = allStudents.filter(s => s.role?.name === 'student');
  const teachers = allStudents.filter(s => s.role?.name === 'teacher');
  const avgScore = allSessions.length > 0 
    ? Math.round(allSessions.reduce((acc, session) => acc + (session.fluency_score || 0), 0) / allSessions.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-purple-100">Manage the entire Upadhyai platform</p>
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
            <p className="text-xs text-muted-foreground">Registered learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground">Active instructors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allSessions.length}</div>
            <p className="text-xs text-muted-foreground">Training completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Average</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Agents Overview */}
      <Card>
        <CardHeader>
          <CardTitle>AI Agents Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {accessibleAgents.map((agent) => (
              <Link key={agent.id} to={agent.route}>
                <Button variant="outline" className="h-20 w-full flex flex-col gap-2">
                  <div className="text-lg">{agent.name}</div>
                  <div className="text-xs text-gray-500">{agent.description}</div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Management */}
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
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
                    <p className="text-xs text-gray-400">
                      Sessions: {studentSessions.length} | 
                      Roll: {student.Roll_Number || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    {studentAvg > 0 ? (
                      <Badge variant={studentAvg >= 80 ? 'default' : studentAvg >= 60 ? 'secondary' : 'destructive'}>
                        {studentAvg}% avg
                      </Badge>
                    ) : (
                      <Badge variant="outline">No sessions</Badge>
                    )}
                    <div className="text-xs text-gray-500">
                      Joined: {new Date(student.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col gap-2" asChild>
              <Link to="/upload-resume">
                <Upload className="h-6 w-6" />
                Bulk Upload
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/profile">
                <Settings className="h-6 w-6" />
                Platform Settings
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/test-webhook">
                <BarChart3 className="h-6 w-6" />
                Test Webhooks
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
