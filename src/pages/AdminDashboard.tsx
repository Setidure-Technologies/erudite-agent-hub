
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  Shield, 
  Settings,
  Activity,
  TrendingUp,
  Search,
  Eye,
  Edit,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const { allStudents, allSessions, accessibleAgents, loading, refetch } = useRoleAccess();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  const filteredStudents = allStudents.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.Roll_Number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (studentId: string, newRoleId: string) => {
    try {
      const { error } = await supabase
        .from('Profiles')
        .update({ role_id: newRoleId })
        .eq('id', studentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student role updated successfully.",
      });

      refetch();
      setEditingRole(null);
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update student role.",
        variant: "destructive",
      });
    }
  };

  const getSystemStats = () => {
    const totalStudents = allStudents.filter(s => s.role?.name === 'student').length;
    const totalTeachers = allStudents.filter(s => s.role?.name === 'teacher').length;
    const avgScore = allSessions.length > 0 
      ? Math.round(allSessions.reduce((acc, session) => acc + (session.fluency_score || 0), 0) / allSessions.length)
      : 0;
    const completedProfiles = allStudents.filter(s => s.name && s.email && s['technical skills of the student']).length;
    
    return { totalStudents, totalTeachers, avgScore, completedProfiles };
  };

  const stats = getSystemStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-red-100">Complete system overview and management</p>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.completedProfiles / allStudents.length) * 100)}% profiles completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              Active faculty members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              Total training sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore}%</div>
            <p className="text-xs text-muted-foreground">
              Overall fluency score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name, email, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{student.name || 'No name'}</h3>
                        <p className="text-gray-600">{student.email}</p>
                        {student.Roll_Number && (
                          <p className="text-sm text-gray-500">Roll No: {student.Roll_Number}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {student.role?.name || 'No role'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRole(editingRole === student.id ? null : student.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {editingRole === student.id && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium mb-2">Change Role:</h4>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant={student.role?.name === 'student' ? 'default' : 'outline'}
                            onClick={() => handleRoleChange(student.id, 'student-role-id')}
                          >
                            Student
                          </Button>
                          <Button 
                            size="sm" 
                            variant={student.role?.name === 'teacher' ? 'default' : 'outline'}
                            onClick={() => handleRoleChange(student.id, 'teacher-role-id')}
                          >
                            Teacher
                          </Button>
                          <Button 
                            size="sm" 
                            variant={student.role?.name === 'admin' ? 'default' : 'outline'}
                            onClick={() => handleRoleChange(student.id, 'admin-role-id')}
                          >
                            Admin
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <span className="text-sm text-gray-600">Age:</span>
                        <p className="font-medium">
                          {student['current age of the student'] || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Graduation:</span>
                        <p className="font-medium">
                          {student['type of degree obtained during graduation'] || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Experience:</span>
                        <p className="font-medium">
                          {student['total work experience of the student in months'] 
                            ? `${student['total work experience of the student in months']} months`
                            : 'No experience'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Sessions:</span>
                        <p className="font-medium">
                          {allSessions.filter(s => s.user_id === student.user_id).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStudent(student)}
                    className="ml-4"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>High Performers (80%+)</span>
                <Badge variant="default">
                  {allSessions.filter(s => s.fluency_score >= 80).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Performers (60-79%)</span>
                <Badge variant="secondary">
                  {allSessions.filter(s => s.fluency_score >= 60 && s.fluency_score < 80).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Need Improvement (<60%)</span>
                <Badge variant="destructive">
                  {allSessions.filter(s => s.fluency_score < 60).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Active Agents</span>
                <Badge variant="default">{accessibleAgents.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Profile Completion Rate</span>
                <Badge variant="secondary">
                  {Math.round((stats.completedProfiles / allStudents.length) * 100)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Recent Sessions (7 days)</span>
                <Badge variant="default">
                  {allSessions.filter(s => 
                    new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Student Full Profile Modal */}
      {selectedStudent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Complete Profile: {selectedStudent.name}</span>
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Full Name:</span>
                    <p className="font-medium">{selectedStudent.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">{selectedStudent.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Roll Number:</span>
                    <p className="font-medium">{selectedStudent.Roll_Number || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Date of Birth:</span>
                    <p className="font-medium">{selectedStudent['date of birth in mm/dd/yyyy format'] || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Gender:</span>
                    <p className="font-medium">{selectedStudent['gender of the student'] || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Current Age:</span>
                    <p className="font-medium">{selectedStudent['current age of the student'] || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Complete Academic History */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Complete Academic History</h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">Class 10</h5>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <span className="text-sm text-blue-600">School:</span>
                        <p className="font-medium">{selectedStudent['name of the school attended for class 10'] || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-blue-600">Board:</span>
                        <p className="font-medium">{selectedStudent['education board for class 10'] || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-blue-600">Percentage:</span>
                        <p className="font-medium">{selectedStudent['percentage marks scored in class 10'] ? `${selectedStudent['percentage marks scored in class 10']}%` : 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-blue-600">Year:</span>
                        <p className="font-medium">{selectedStudent['year when class 10 was completed'] || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">Class 12</h5>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div>
                        <span className="text-sm text-green-600">School:</span>
                        <p className="font-medium">{selectedStudent['name of the school attended for class 12'] || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-green-600">Board:</span>
                        <p className="font-medium">{selectedStudent['education board for class 12'] || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-green-600">Stream:</span>
                        <p className="font-medium">{selectedStudent['academic stream chosen in class 12'] || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-green-600">Percentage:</span>
                        <p className="font-medium">{selectedStudent['percentage marks scored in class 12'] ? `${selectedStudent['percentage marks scored in class 12']}%` : 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-green-600">Year:</span>
                        <p className="font-medium">{selectedStudent['year when class 12 was completed'] || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">Graduation</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <span className="text-sm text-purple-600">College:</span>
                        <p className="font-medium">{selectedStudent['name of the college attended for graduation'] || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-purple-600">University:</span>
                        <p className="font-medium">{selectedStudent['name of the university attended for graduation'] || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-purple-600">Degree:</span>
                        <p className="font-medium">{selectedStudent['type of degree obtained during graduation'] || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-purple-600">Specialization:</span>
                        <p className="font-medium">{selectedStudent['specialization pursued during graduation'] || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-purple-600">Percentage:</span>
                        <p className="font-medium">{selectedStudent['percentage marks obtained during graduation'] ? `${selectedStudent['percentage marks obtained during graduation']}%` : 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-purple-600">Year:</span>
                        <p className="font-medium">{selectedStudent['year when graduation was completed'] || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All other fields in organized sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Skills & Competencies</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Technical Skills:</span>
                      <p className="font-medium bg-gray-50 p-2 rounded">{selectedStudent['technical skills of the student'] || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Soft Skills:</span>
                      <p className="font-medium bg-gray-50 p-2 rounded">{selectedStudent['interpersonal or soft skills of the student'] || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Languages:</span>
                      <p className="font-medium bg-gray-50 p-2 rounded">{selectedStudent['Languages the student can speak, understand, or is proficient i'] || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Career Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Career Goal:</span>
                      <p className="font-medium bg-gray-50 p-2 rounded">{selectedStudent['Desired job role or long-term career goal of the student'] || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Primary Specialization:</span>
                      <p className="font-medium bg-gray-50 p-2 rounded">{selectedStudent['First area of academic or professional specialization of the st'] || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Secondary Specialization:</span>
                      <p className="font-medium bg-gray-50 p-2 rounded">{selectedStudent['Second area of academic or professional specialization of the s'] || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
