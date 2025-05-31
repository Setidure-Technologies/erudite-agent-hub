
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Bot, BarChart3, Briefcase, Target } from 'lucide-react';

const agents = [
  {
    name: 'Verify Profile',
    description: 'Extract and verify profile details from your resume',
    icon: Bot,
    href: '/verify-profile',
  },
  {
    name: 'Skill Gap Analysis',
    description: 'Analyze skill gaps against job descriptions',
    icon: BarChart3,
    href: '/analyze-skill-gap',
  },
  {
    name: 'Job Recommender',
    description: 'Get personalized job recommendations',
    icon: Briefcase,
    href: '/recommend-jobs',
  },
  {
    name: 'Interview Coach',
    description: 'Practice interviews with AI coaching',
    icon: Target,
    href: '/interview-coach',
  },
];

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Upadhyai!
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Your AI-powered career development platform
        </p>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Set up your profile to unlock all features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/profile">Go to Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card key={agent.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <agent.icon className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-lg">{agent.name}</CardTitle>
              </div>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to={agent.href}>Open {agent.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
