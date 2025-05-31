
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    'gender of the student': '',
    'date of birth in mm/dd/yyyy format': '',
    'name of the school attended for class 10': '',
    'education board for class 10': '',
    'percentage marks scored in class 10': '',
    'year when class 10 was completed': '',
    'name of the school attended for class 12': '',
    'education board for class 12': '',
    'percentage marks scored in class 12': '',
    'year when class 12 was completed': '',
    'academic stream chosen in class 12': '',
    'name of the college attended for graduation': '',
    'name of the university attended for graduation': '',
    'type of degree obtained during graduation': '',
    'specialization pursued during graduation': '',
    'percentage marks obtained during graduation': '',
    'year when graduation was completed': '',
    'cgpa during mba program': '',
    'technical skills of the student': '',
    'interpersonal or soft skills of the student': '',
    'does the student have any prior work experience': '',
    'total work experience of the student in months': '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          name: data.name || '',
          email: data.email || user?.email || '',
          'gender of the student': data['gender of the student'] || '',
          'date of birth in mm/dd/yyyy format': data['date of birth in mm/dd/yyyy format'] || '',
          'name of the school attended for class 10': data['name of the school attended for class 10'] || '',
          'education board for class 10': data['education board for class 10'] || '',
          'percentage marks scored in class 10': data['percentage marks scored in class 10']?.toString() || '',
          'year when class 10 was completed': data['year when class 10 was completed']?.toString() || '',
          'name of the school attended for class 12': data['name of the school attended for class 12'] || '',
          'education board for class 12': data['education board for class 12'] || '',
          'percentage marks scored in class 12': data['percentage marks scored in class 12']?.toString() || '',
          'year when class 12 was completed': data['year when class 12 was completed']?.toString() || '',
          'academic stream chosen in class 12': data['academic stream chosen in class 12'] || '',
          'name of the college attended for graduation': data['name of the college attended for graduation'] || '',
          'name of the university attended for graduation': data['name of the university attended for graduation'] || '',
          'type of degree obtained during graduation': data['type of degree obtained during graduation'] || '',
          'specialization pursued during graduation': data['specialization pursued during graduation'] || '',
          'percentage marks obtained during graduation': data['percentage marks obtained during graduation']?.toString() || '',
          'year when graduation was completed': data['year when graduation was completed']?.toString() || '',
          'cgpa during mba program': data['cgpa during mba program']?.toString() || '',
          'technical skills of the student': data['technical skills of the student'] || '',
          'interpersonal or soft skills of the student': data['interpersonal or soft skills of the student'] || '',
          'does the student have any prior work experience': data['does the student have any prior work experience'] || '',
          'total work experience of the student in months': data['total work experience of the student in months'] || '',
        });
      } else {
        setProfile(prev => ({ ...prev, email: user?.email || '' }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const profileData = {
        user_id: user?.id,
        name: profile.name,
        email: profile.email,
        'gender of the student': profile['gender of the student'],
        'date of birth in mm/dd/yyyy format': profile['date of birth in mm/dd/yyyy format'],
        'name of the school attended for class 10': profile['name of the school attended for class 10'],
        'education board for class 10': profile['education board for class 10'],
        'percentage marks scored in class 10': profile['percentage marks scored in class 10'] ? parseFloat(profile['percentage marks scored in class 10']) : null,
        'year when class 10 was completed': profile['year when class 10 was completed'] ? parseInt(profile['year when class 10 was completed']) : null,
        'name of the school attended for class 12': profile['name of the school attended for class 12'],
        'education board for class 12': profile['education board for class 12'],
        'percentage marks scored in class 12': profile['percentage marks scored in class 12'] ? parseFloat(profile['percentage marks scored in class 12']) : null,
        'year when class 12 was completed': profile['year when class 12 was completed'] ? parseInt(profile['year when class 12 was completed']) : null,
        'academic stream chosen in class 12': profile['academic stream chosen in class 12'],
        'name of the college attended for graduation': profile['name of the college attended for graduation'],
        'name of the university attended for graduation': profile['name of the university attended for graduation'],
        'type of degree obtained during graduation': profile['type of degree obtained during graduation'],
        'specialization pursued during graduation': profile['specialization pursued during graduation'],
        'percentage marks obtained during graduation': profile['percentage marks obtained during graduation'] ? parseFloat(profile['percentage marks obtained during graduation']) : null,
        'year when graduation was completed': profile['year when graduation was completed'] ? parseInt(profile['year when graduation was completed']) : null,
        'cgpa during mba program': profile['cgpa during mba program'] ? parseFloat(profile['cgpa during mba program']) : null,
        'technical skills of the student': profile['technical skills of the student'],
        'interpersonal or soft skills of the student': profile['interpersonal or soft skills of the student'],
        'does the student have any prior work experience': profile['does the student have any prior work experience'],
        'total work experience of the student in months': profile['total work experience of the student in months'],
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={profile.email}
                onChange={(e) => updateProfile('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <Input
                value={profile['gender of the student']}
                onChange={(e) => updateProfile('gender of the student', e.target.value)}
                placeholder="Enter your gender"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth (MM/DD/YYYY)</label>
              <Input
                value={profile['date of birth in mm/dd/yyyy format']}
                onChange={(e) => updateProfile('date of birth in mm/dd/yyyy format', e.target.value)}
                placeholder="MM/DD/YYYY"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Class 10 Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">School Name</label>
                <Input
                  value={profile['name of the school attended for class 10']}
                  onChange={(e) => updateProfile('name of the school attended for class 10', e.target.value)}
                  placeholder="School name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Education Board</label>
                <Input
                  value={profile['education board for class 10']}
                  onChange={(e) => updateProfile('education board for class 10', e.target.value)}
                  placeholder="Education board"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Percentage</label>
                <Input
                  value={profile['percentage marks scored in class 10']}
                  onChange={(e) => updateProfile('percentage marks scored in class 10', e.target.value)}
                  placeholder="Percentage"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year of Completion</label>
                <Input
                  value={profile['year when class 10 was completed']}
                  onChange={(e) => updateProfile('year when class 10 was completed', e.target.value)}
                  placeholder="Year"
                  type="number"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Class 12 Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">School Name</label>
                <Input
                  value={profile['name of the school attended for class 12']}
                  onChange={(e) => updateProfile('name of the school attended for class 12', e.target.value)}
                  placeholder="School name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Education Board</label>
                <Input
                  value={profile['education board for class 12']}
                  onChange={(e) => updateProfile('education board for class 12', e.target.value)}
                  placeholder="Education board"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stream</label>
                <Input
                  value={profile['academic stream chosen in class 12']}
                  onChange={(e) => updateProfile('academic stream chosen in class 12', e.target.value)}
                  placeholder="Academic stream"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Percentage</label>
                <Input
                  value={profile['percentage marks scored in class 12']}
                  onChange={(e) => updateProfile('percentage marks scored in class 12', e.target.value)}
                  placeholder="Percentage"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year of Completion</label>
                <Input
                  value={profile['year when class 12 was completed']}
                  onChange={(e) => updateProfile('year when class 12 was completed', e.target.value)}
                  placeholder="Year"
                  type="number"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Graduation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">College Name</label>
                <Input
                  value={profile['name of the college attended for graduation']}
                  onChange={(e) => updateProfile('name of the college attended for graduation', e.target.value)}
                  placeholder="College name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">University</label>
                <Input
                  value={profile['name of the university attended for graduation']}
                  onChange={(e) => updateProfile('name of the university attended for graduation', e.target.value)}
                  placeholder="University name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Degree Type</label>
                <Input
                  value={profile['type of degree obtained during graduation']}
                  onChange={(e) => updateProfile('type of degree obtained during graduation', e.target.value)}
                  placeholder="Degree type"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Specialization</label>
                <Input
                  value={profile['specialization pursued during graduation']}
                  onChange={(e) => updateProfile('specialization pursued during graduation', e.target.value)}
                  placeholder="Specialization"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Percentage</label>
                <Input
                  value={profile['percentage marks obtained during graduation']}
                  onChange={(e) => updateProfile('percentage marks obtained during graduation', e.target.value)}
                  placeholder="Percentage"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year of Completion</label>
                <Input
                  value={profile['year when graduation was completed']}
                  onChange={(e) => updateProfile('year when graduation was completed', e.target.value)}
                  placeholder="Year"
                  type="number"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">MBA CGPA</label>
            <Input
              value={profile['cgpa during mba program']}
              onChange={(e) => updateProfile('cgpa during mba program', e.target.value)}
              placeholder="CGPA"
              type="number"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Technical Skills</label>
            <Textarea
              value={profile['technical skills of the student']}
              onChange={(e) => updateProfile('technical skills of the student', e.target.value)}
              placeholder="List your technical skills"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Interpersonal/Soft Skills</label>
            <Textarea
              value={profile['interpersonal or soft skills of the student']}
              onChange={(e) => updateProfile('interpersonal or soft skills of the student', e.target.value)}
              placeholder="List your soft skills"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Have Work Experience?</label>
              <Input
                value={profile['does the student have any prior work experience']}
                onChange={(e) => updateProfile('does the student have any prior work experience', e.target.value)}
                placeholder="Yes/No"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Total Work Experience (months)</label>
              <Input
                value={profile['total work experience of the student in months']}
                onChange={(e) => updateProfile('total work experience of the student in months', e.target.value)}
                placeholder="Total months"
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
