
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  BarChart3, 
  Briefcase, 
  Target, 
  Mic, 
  Users, 
  BookOpen, 
  Shield, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Globe,
  TrendingUp,
  Award,
  MessageSquare,
  Brain,
  FileText,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const features = [
    {
      id: 'resume-upload',
      icon: Upload,
      title: 'Smart Resume Analysis',
      description: 'Upload your resume and get AI-powered insights on strengths, gaps, and improvement recommendations.',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'skill-gap',
      icon: BarChart3,
      title: 'Skill Gap Analysis',
      description: 'Identify skill gaps in your profile and get personalized learning paths to bridge them.',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'job-recommendation',
      icon: Briefcase,
      title: 'Job Recommendations',
      description: 'Get tailored job recommendations based on your skills, experience, and career goals.',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'interview-coach',
      icon: Target,
      title: 'Interview Coaching',
      description: 'Practice with AI-powered interview simulations and get feedback to ace your interviews.',
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'voice-training',
      icon: Mic,
      title: 'Voice Training (Vaakshakti)',
      description: 'Improve your communication skills with our advanced voice analysis and training system.',
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600'
    },
    {
      id: 'profile-management',
      icon: Users,
      title: 'Profile Management',
      description: 'Comprehensive profile system with role-based access for students, teachers, and administrators.',
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ];

  const roles = [
    {
      title: 'Students',
      icon: Users,
      description: 'Access all learning tools, skill assessments, and career guidance',
      features: ['Resume Analysis', 'Skill Gap Assessment', 'Job Recommendations', 'Interview Practice', 'Voice Training']
    },
    {
      title: 'Teachers',
      icon: BookOpen,
      description: 'Monitor student progress and provide personalized guidance',
      features: ['Student Progress Tracking', 'Performance Analytics', 'Feedback System', 'Mentoring Tools']
    },
    {
      title: 'Administrators',
      icon: Shield,
      description: 'Manage the entire platform with comprehensive admin controls',
      features: ['User Management', 'System Analytics', 'Content Management', 'Role Configuration']
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Users' },
    { number: '1000+', label: 'Resumes Analyzed' },
    { number: '95%', label: 'Skill Gap Accuracy' },
    { number: '4.8/5', label: 'User Rating' }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'MBA Graduate',
      content: 'The skill gap analysis helped me identify exactly what I needed to work on. Got my dream job within 3 months!',
      rating: 5
    },
    {
      name: 'Rahul Kumar',
      role: 'Engineering Student',
      content: 'The interview coaching feature boosted my confidence significantly. Highly recommend to all students.',
      rating: 5
    },
    {
      name: 'Dr. Anjali Gupta',
      role: 'Career Counselor',
      content: 'As an educator, I find the teacher dashboard incredibly useful for tracking student progress.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Upadhyai</span>
              <Badge variant="secondary" className="ml-2">AI-Powered</Badge>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#roles" className="text-gray-600 hover:text-blue-600 transition-colors">For Everyone</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
            </nav>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Transform Your
                <span className="block text-blue-600">Career Journey</span>
                with AI
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-8">
                Comprehensive AI-powered platform for skill development, career guidance, and professional growth. 
                From resume analysis to interview coaching, we've got everything you need to succeed.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="group">
                  <Play className="mr-2 h-5 w-5 group-hover:text-blue-600" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white rounded-xl shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">AI Analysis Complete</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Your Career Score</h3>
                    <div className="mt-2 flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">85/100</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <div className="text-sm text-gray-600">Skills Identified</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">3</div>
                      <div className="text-sm text-gray-600">Areas to Improve</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600">{stat.number}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Powerful Features for Career Growth
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of AI-powered tools helps you at every stage of your career journey
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl border-0 bg-white ${
                  hoveredCard === feature.id ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Designed for Everyone
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Tailored experiences for students, teachers, and administrators
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <Card key={index} className="text-center border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <role.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              What Our Users Say
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Success stories from students, professionals, and educators
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.content}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Ready to Transform Your Career?
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of users who are already accelerating their career growth with our AI-powered platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
              <Zap className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
              <MessageSquare className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">Upadhyai</span>
              </div>
              <p className="text-gray-400">
                AI-powered career development platform helping students and professionals achieve their goals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Resume Analysis</li>
                <li>Skill Gap Assessment</li>
                <li>Job Recommendations</li>
                <li>Interview Coaching</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Students</li>
                <li>Teachers</li>
                <li>Administrators</li>
                <li>Institutions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@upadhyai.com</li>
                <li>+91 1234567890</li>
                <li>Help Center</li>
                <li>Documentation</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Upadhyai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
