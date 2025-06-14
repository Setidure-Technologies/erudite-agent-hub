
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Briefcase, Loader2, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const RecommendJobs = () => {
  const { userProfile } = useRoleAccess();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    desired_role: '',
    experience_level: '',
    preferred_location: '',
    skills: '',
    industry_preference: ''
  });
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate webhook call - replace with actual webhook URL
      const webhookUrl = process.env.VITE_WEBHOOK_URL || 'https://webhook.example.com/recommend-jobs';
      
      const payload = {
        user_id: userProfile?.user_id,
        user_profile: userProfile,
        job_preferences: formData,
        timestamp: new Date().toISOString()
      };

      console.log('Sending job recommendation request:', payload);

      // For demo purposes, simulate API response
      setTimeout(() => {
        const mockResults = {
          recommended_jobs: [
            {
              title: "Software Engineer",
              company: "TechCorp",
              location: "Bangalore",
              match_score: 92,
              salary_range: "₹12-18 LPA",
              requirements: ["React", "Node.js", "JavaScript"]
            },
            {
              title: "Frontend Developer",
              company: "StartupXYZ",
              location: "Remote",
              match_score: 88,
              salary_range: "₹8-15 LPA",
              requirements: ["React", "TypeScript", "CSS"]
            },
            {
              title: "Full Stack Developer",
              company: "DevCorp",
              location: "Mumbai",
              match_score: 85,
              salary_range: "₹15-22 LPA",
              requirements: ["React", "Node.js", "MongoDB"]
            }
          ],
          analysis: {
            profile_strength: 85,
            missing_skills: ["AWS", "Docker", "Kubernetes"],
            improvement_suggestions: [
              "Consider learning cloud technologies",
              "Build more projects showcasing full-stack capabilities",
              "Obtain relevant certifications"
            ]
          }
        };

        setResults(mockResults);
        toast({
          title: "Success",
          description: "Job recommendations generated successfully!",
        });
        setLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Error calling webhook:', error);
      toast({
        title: "Error",
        description: "Failed to get job recommendations. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            Job Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Get personalized job recommendations based on your profile and preferences using AI analysis.
          </p>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Job Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Desired Role</label>
                <Input
                  value={formData.desired_role}
                  onChange={(e) => handleInputChange('desired_role', e.target.value)}
                  placeholder="e.g., Software Engineer, Data Scientist"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Experience Level</label>
                <Select value={formData.experience_level} onValueChange={(value) => handleInputChange('experience_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fresher">Fresher (0-1 years)</SelectItem>
                    <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                    <SelectItem value="mid">Mid-level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Location</label>
                <Input
                  value={formData.preferred_location}
                  onChange={(e) => handleInputChange('preferred_location', e.target.value)}
                  placeholder="e.g., Bangalore, Remote, Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Industry Preference</label>
                <Select value={formData.industry_preference} onValueChange={(value) => handleInputChange('industry_preference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Key Skills</label>
              <Textarea
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="List your key skills, separated by commas"
                rows={3}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Recommendations...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Get Job Recommendations
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Profile Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{results.analysis.profile_strength}%</div>
                  <div className="text-sm text-gray-600">Profile Strength</div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Missing Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {results.analysis.missing_skills.map((skill: string, index: number) => (
                      <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Suggestions</h4>
                  <ul className="text-sm space-y-1">
                    {results.analysis.improvement_suggestions.slice(0, 2).map((suggestion: string, index: number) => (
                      <li key={index} className="text-gray-600">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.recommended_jobs.map((job: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-gray-600">{job.company} • {job.location}</p>
                        <p className="text-green-600 font-medium">{job.salary_range}</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {job.match_score}% Match
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Required Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.map((skill: string, skillIndex: number) => (
                          <span key={skillIndex} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RecommendJobs;
