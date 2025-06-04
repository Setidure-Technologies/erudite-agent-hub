
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { 
  Briefcase, 
  BarChart3, 
  GraduationCap, 
  FileText, 
  TrendingUp, 
  Search, 
  Target, 
  BookOpen, 
  FileEdit, 
  Mic,
  Shield,
  User
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'Briefcase': Briefcase,
  'BarChart3': BarChart3,
  'GraduationCap': GraduationCap,
  'FileText': FileText,
  'TrendingUp': TrendingUp,
  'Search': Search,
  'Target': Target,
  'BookOpen': BookOpen,
  'FileEdit': FileEdit,
  'Mic': Mic,
};

const Home = () => {
  const navigate = useNavigate();
  const { userRole, accessibleAgents, loading, isAdmin } = useRoleAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Welcome to Upadhyai</h1>
            <p className="text-blue-100">Your AI-powered career development platform</p>
          </div>
        </div>
        
        {userRole && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {userRole.name.charAt(0).toUpperCase() + userRole.name.slice(1)}
            </Badge>
            <span className="text-blue-100">{userRole.description}</span>
          </div>
        )}
      </div>

      {/* Admin Quick Access */}
      {isAdmin() && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Shield className="h-5 w-5" />
              Admin Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-4">
              Manage roles, agent access, and view system analytics.
            </p>
            <Button 
              onClick={() => navigate('/admin')} 
              className="bg-orange-600 hover:bg-orange-700"
            >
              Open Admin Panel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Available Agents */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available AI Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibleAgents.map((agent) => {
            const IconComponent = iconMap[agent.icon] || FileText;
            
            return (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-lg">{agent.name}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{agent.description}</p>
                  <Button 
                    onClick={() => navigate(agent.route)}
                    className="w-full"
                  >
                    Access Agent
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {accessibleAgents.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No agents available for your role.</div>
            <div className="text-sm text-gray-400 mt-2">
              Contact your administrator to get access to AI agents.
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile')}
              className="justify-start"
            >
              <User className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
            
            {accessibleAgents.some(a => a.route === '/voice-training') && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/voice-training')}
                className="justify-start"
              >
                <Mic className="h-4 w-4 mr-2" />
                Voice Training
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
