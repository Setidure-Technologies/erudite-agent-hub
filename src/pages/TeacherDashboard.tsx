
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { 
  Users, 
  BookOpen, 
  Award,
  Search,
  Eye,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

const TeacherDashboard = () => {
  const { allStudents, allSessions, loading } = useRoleAccess();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading teacher dashboard...</div>
      </div>
    );
  }

  const filteredStudents = allStudents.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.Roll_Number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const studentSessions = allSessions.filter(session => 
    selectedStudent ? session.user_id === selectedStudent.user_id : true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-green-100">Monitor student progress and provide guidance</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allStudents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allSessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allSessions.length > 0 
                ? Math.round(allSessions.reduce((acc, session) => acc + (session.fluency_score || 0), 0) / allSessions.length)
                : 0
              }%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Search and List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Management
          </CardTitle>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students by name, email, or roll number..."
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
                      <Badge variant="outline">
                        {student.role?.name || 'No role'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <span className="text-sm text-gray-600">Graduation:</span>
                        <p className="font-medium">
                          {student['type of degree obtained during graduation'] || 'Not specified'}
                          {student['specialization pursued during graduation'] && 
                            ` - ${student['specialization pursued during graduation']}`
                          }
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
                        <span className="text-sm text-gray-600">Career Goal:</span>
                        <p className="font-medium">
                          {student['Desired job role or long-term career goal of the student'] || 'Not specified'}
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
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Student Details */}
      {selectedStudent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Student Details: {selectedStudent.name}</span>
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Academic Performance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Class 10</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedStudent['percentage marks scored in class 10'] 
                      ? `${selectedStudent['percentage marks scored in class 10']}%`
                      : 'N/A'
                    }
                  </p>
                  <p className="text-sm text-blue-700">
                    {selectedStudent['education board for class 10'] || 'Board not specified'}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">Class 12</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedStudent['percentage marks scored in class 12'] 
                      ? `${selectedStudent['percentage marks scored in class 12']}%`
                      : 'N/A'
                    }
                  </p>
                  <p className="text-sm text-green-700">
                    {selectedStudent['academic stream chosen in class 12'] || 'Stream not specified'}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Graduation</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedStudent['percentage marks obtained during graduation'] 
                      ? `${selectedStudent['percentage marks obtained during graduation']}%`
                      : 'N/A'
                    }
                  </p>
                  <p className="text-sm text-purple-700">
                    {selectedStudent['type of degree obtained during graduation'] || 'Degree not specified'}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Technical Skills</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedStudent['technical skills of the student'] || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Soft Skills</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedStudent['interpersonal or soft skills of the student'] || 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Voice Training Sessions */}
              <div>
                <h4 className="font-semibold mb-3">Voice Training Sessions</h4>
                <div className="space-y-3">
                  {studentSessions.length > 0 ? (
                    studentSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{session.question}</h5>
                          {session.fluency_score && (
                            <Badge variant={session.fluency_score >= 80 ? "default" : session.fluency_score >= 60 ? "secondary" : "destructive"}>
                              {session.fluency_score}%
                            </Badge>
                          )}
                        </div>
                        {session.transcript && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Response:</strong> {session.transcript}
                          </p>
                        )}
                        {session.grammar_feedback && (
                          <p className="text-sm text-blue-600">
                            <strong>Feedback:</strong> {session.grammar_feedback}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(session.created_at).toLocaleDateString()} - 
                          Duration: {session.duration_seconds ? `${session.duration_seconds}s` : 'N/A'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No voice training sessions yet.</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherDashboard;
