
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Award,
  Calendar,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react';

const StudentDashboard = () => {
  const { userProfile, loading } = useRoleAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No profile data available.</div>
      </div>
    );
  }

  const calculateProfileCompletion = () => {
    const fields = [
      userProfile.name,
      userProfile.email,
      userProfile['date of birth in mm/dd/yyyy format'],
      userProfile['gender of the student'],
      userProfile['technical skills of the student'],
      userProfile['type of degree obtained during graduation'],
      userProfile['specialization pursued during graduation']
    ];
    const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userProfile.name || 'Student'}!</h1>
            <p className="text-blue-100">Your comprehensive academic and career profile</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-white/20 text-white">
            {userProfile.role?.name?.charAt(0).toUpperCase() + userProfile.role?.name?.slice(1)}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-blue-100">Profile Completion:</span>
            <div className="w-32 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProfileCompletion()}%` }}
              />
            </div>
            <span className="text-white font-semibold">{calculateProfileCompletion()}%</span>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Age</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile['current age of the student'] || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Experience</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile['total work experience of the student in months'] 
                ? `${userProfile['total work experience of the student in months']} months`
                : 'N/A'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graduation %</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile['percentage marks obtained during graduation'] 
                ? `${userProfile['percentage marks obtained during graduation']}%`
                : 'N/A'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MBA CGPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile['cgpa during mba program'] || 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Academic History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Class 10 */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg">Class 10</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <span className="text-sm text-gray-600">School:</span>
                  <p className="font-medium">{userProfile['name of the school attended for class 10'] || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Board:</span>
                  <p className="font-medium">{userProfile['education board for class 10'] || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Percentage:</span>
                  <p className="font-medium">{userProfile['percentage marks scored in class 10'] ? `${userProfile['percentage marks scored in class 10']}%` : 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Class 12 */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg">Class 12</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <div>
                  <span className="text-sm text-gray-600">School:</span>
                  <p className="font-medium">{userProfile['name of the school attended for class 12'] || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Board:</span>
                  <p className="font-medium">{userProfile['education board for class 12'] || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Stream:</span>
                  <p className="font-medium">{userProfile['academic stream chosen in class 12'] || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Percentage:</span>
                  <p className="font-medium">{userProfile['percentage marks scored in class 12'] ? `${userProfile['percentage marks scored in class 12']}%` : 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Graduation */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg">Graduation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                <div>
                  <span className="text-sm text-gray-600">College:</span>
                  <p className="font-medium">{userProfile['name of the college attended for graduation'] || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">University:</span>
                  <p className="font-medium">{userProfile['name of the university attended for graduation'] || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Degree:</span>
                  <p className="font-medium">{userProfile['type of degree obtained during graduation'] || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Specialization:</span>
                  <p className="font-medium">{userProfile['specialization pursued during graduation'] || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      {userProfile['does the student have any prior work experience'] === 'Yes' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* First Organization */}
              {userProfile['name of the first organization worked at'] && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg">{userProfile['name of the first organization worked at']}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <span className="text-sm text-gray-600">Position:</span>
                      <p className="font-medium">{userProfile['job title or designation at first organization'] || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Domain:</span>
                      <p className="font-medium">{userProfile['domain or function at first organization'] || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Duration:</span>
                      <p className="font-medium">{userProfile['duration of work experience at first organization in months'] ? `${userProfile['duration of work experience at first organization in months']} months` : 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Second Organization */}
              {userProfile['name of the second organization worked at'] && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg">{userProfile['name of the second organization worked at']}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <span className="text-sm text-gray-600">Position:</span>
                      <p className="font-medium">{userProfile['job title or designation at second organization'] || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Domain:</span>
                      <p className="font-medium">{userProfile['domain or function at second organization'] || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Duration:</span>
                      <p className="font-medium">{userProfile['duration of work experience at second organization in months'] ? `${userProfile['duration of work experience at second organization in months']} months` : 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Third Organization */}
              {userProfile['name of the third organization worked at'] && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg">{userProfile['name of the third organization worked at']}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <span className="text-sm text-gray-600">Position:</span>
                      <p className="font-medium">{userProfile['job title or designation at third organization'] || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Domain:</span>
                      <p className="font-medium">{userProfile['domain or function at third organization'] || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Duration:</span>
                      <p className="font-medium">{userProfile['duration of work experience at third organization in months'] ? `${userProfile['duration of work experience at third organization in months']} months` : 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Skills & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Technical Skills</h4>
              <p className="text-gray-700">{userProfile['technical skills of the student'] || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Soft Skills</h4>
              <p className="text-gray-700">{userProfile['interpersonal or soft skills of the student'] || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Languages</h4>
              <p className="text-gray-700">{userProfile['Languages the student can speak, understand, or is proficient i'] || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Career Goals & Specializations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Career Goal</h4>
              <p className="text-gray-700">{userProfile['Desired job role or long-term career goal of the student'] || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Primary Specialization</h4>
              <p className="text-gray-700">{userProfile['First area of academic or professional specialization of the st'] || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Secondary Specialization</h4>
              <p className="text-gray-700">{userProfile['Second area of academic or professional specialization of the s'] || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MBA & Research */}
      {userProfile['cgpa during mba program'] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              MBA & Research Work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">MBA CGPA</h4>
                <p className="text-2xl font-bold text-blue-600">{userProfile['cgpa during mba program']}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Summer Internship</h4>
                <p className="text-gray-700">{userProfile['Name of the organization where the student completed their summ'] || 'Not specified'}</p>
                <p className="text-sm text-gray-600">{userProfile['Role or profile undertaken by the student during their summer i'] || ''}</p>
              </div>
            </div>
            {userProfile['projects or research work done during mba'] && (
              <div>
                <h4 className="font-semibold mb-2">Projects & Research Work</h4>
                <p className="text-gray-700">{userProfile['projects or research work done during mba']}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;
