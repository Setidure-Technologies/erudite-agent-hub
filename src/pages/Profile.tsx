
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useRoleAccess } from '@/hooks/useRoleAccess';

const Profile = () => {
  const { user } = useAuth();
  const { isAdmin } = useRoleAccess();
  const [profile, setProfile] = useState<any>({});
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchRoles();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Profiles')
        .select(`
          *,
          role:roles(id, name, description)
        `)
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Initialize with user email if no profile exists
        setProfile({ 
          name: user?.user_metadata?.full_name || '',
          email: user?.email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('Profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      let profileData = { ...profile };
      delete profileData.role; // Remove the joined role data

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('Profiles')
          .update(profileData)
          .eq('user_id', user?.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('Profiles')
          .insert({
            user_id: user?.id,
            ...profileData,
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      // Refresh profile to get updated data
      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setProfile((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleChange = (roleId: string) => {
    setProfile((prev: any) => ({
      ...prev,
      role_id: roleId,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Profile Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  value={profile.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={profile.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Roll Number</label>
                <Input
                  value={profile.Roll_Number || ''}
                  onChange={(e) => handleInputChange('Roll_Number', e.target.value)}
                  placeholder="Enter your roll number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth (MM/DD/YYYY)</label>
                <Input
                  value={profile['date of birth in mm/dd/yyyy format'] || ''}
                  onChange={(e) => handleInputChange('date of birth in mm/dd/yyyy format', e.target.value)}
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <Input
                  value={profile['gender of the student'] || ''}
                  onChange={(e) => handleInputChange('gender of the student', e.target.value)}
                  placeholder="Enter your gender"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Current Age</label>
                <Input
                  value={profile['current age of the student'] || ''}
                  onChange={(e) => handleInputChange('current age of the student', parseInt(e.target.value) || '')}
                  placeholder="Enter your age"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Role Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Role Information</h3>
            {isAdmin ? (
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <Select value={profile.role_id || ''} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name} - {role.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              profile.role && (
                <div>
                  <label className="block text-sm font-medium mb-2">Your Role</label>
                  <Input
                    value={`${profile.role.name} - ${profile.role.description}`}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              )
            )}
          </div>

          {/* Class 10 Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Class 10 Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">School Name</label>
                <Input
                  value={profile['name of the school attended for class 10'] || ''}
                  onChange={(e) => handleInputChange('name of the school attended for class 10', e.target.value)}
                  placeholder="School name for class 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Education Board</label>
                <Input
                  value={profile['education board for class 10'] || ''}
                  onChange={(e) => handleInputChange('education board for class 10', e.target.value)}
                  placeholder="Education board for class 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Percentage Marks</label>
                <Input
                  value={profile['percentage marks scored in class 10'] || ''}
                  onChange={(e) => handleInputChange('percentage marks scored in class 10', parseFloat(e.target.value) || '')}
                  placeholder="Percentage marks in class 10"
                  type="number"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year of Completion</label>
                <Input
                  value={profile['year when class 10 was completed'] || ''}
                  onChange={(e) => handleInputChange('year when class 10 was completed', parseInt(e.target.value) || '')}
                  placeholder="Year of class 10 completion"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Class 12 Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Class 12 Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">School Name</label>
                <Input
                  value={profile['name of the school attended for class 12'] || ''}
                  onChange={(e) => handleInputChange('name of the school attended for class 12', e.target.value)}
                  placeholder="School name for class 12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Education Board</label>
                <Input
                  value={profile['education board for class 12'] || ''}
                  onChange={(e) => handleInputChange('education board for class 12', e.target.value)}
                  placeholder="Education board for class 12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Academic Stream</label>
                <Input
                  value={profile['academic stream chosen in class 12'] || ''}
                  onChange={(e) => handleInputChange('academic stream chosen in class 12', e.target.value)}
                  placeholder="Academic stream (Science/Commerce/Arts)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Percentage Marks</label>
                <Input
                  value={profile['percentage marks scored in class 12'] || ''}
                  onChange={(e) => handleInputChange('percentage marks scored in class 12', parseFloat(e.target.value) || '')}
                  placeholder="Percentage marks in class 12"
                  type="number"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year of Completion</label>
                <Input
                  value={profile['year when class 12 was completed'] || ''}
                  onChange={(e) => handleInputChange('year when class 12 was completed', parseInt(e.target.value) || '')}
                  placeholder="Year of class 12 completion"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Graduation Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Graduation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">College Name</label>
                <Input
                  value={profile['name of the college attended for graduation'] || ''}
                  onChange={(e) => handleInputChange('name of the college attended for graduation', e.target.value)}
                  placeholder="College name for graduation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">University Name</label>
                <Input
                  value={profile['name of the university attended for graduation'] || ''}
                  onChange={(e) => handleInputChange('name of the university attended for graduation', e.target.value)}
                  placeholder="University name for graduation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Degree Type</label>
                <Input
                  value={profile['type of degree obtained during graduation'] || ''}
                  onChange={(e) => handleInputChange('type of degree obtained during graduation', e.target.value)}
                  placeholder="e.g., B.Tech, B.A., B.Com, B.Sc"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Specialization</label>
                <Input
                  value={profile['specialization pursued during graduation'] || ''}
                  onChange={(e) => handleInputChange('specialization pursued during graduation', e.target.value)}
                  placeholder="Specialization/Major field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Percentage Marks</label>
                <Input
                  value={profile['percentage marks obtained during graduation'] || ''}
                  onChange={(e) => handleInputChange('percentage marks obtained during graduation', parseFloat(e.target.value) || '')}
                  placeholder="Percentage marks in graduation"
                  type="number"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year of Completion</label>
                <Input
                  value={profile['year when graduation was completed'] || ''}
                  onChange={(e) => handleInputChange('year when graduation was completed', parseInt(e.target.value) || '')}
                  placeholder="Year of graduation completion"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* MBA Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">MBA Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">CGPA during MBA</label>
                <Input
                  value={profile['cgpa during mba program'] || ''}
                  onChange={(e) => handleInputChange('cgpa during mba program', parseFloat(e.target.value) || '')}
                  placeholder="CGPA in MBA program"
                  type="number"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Projects/Research Work during MBA</label>
              <Textarea
                value={profile['projects or research work done during mba'] || ''}
                onChange={(e) => handleInputChange('projects or research work done during mba', e.target.value)}
                placeholder="Describe your projects or research work during MBA"
                rows={4}
              />
            </div>
          </div>

          {/* Skills and Languages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Skills & Languages</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Technical Skills</label>
              <Textarea
                value={profile['technical skills of the student'] || ''}
                onChange={(e) => handleInputChange('technical skills of the student', e.target.value)}
                placeholder="List your technical skills (programming languages, software, tools, etc.)"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Interpersonal/Soft Skills</label>
              <Textarea
                value={profile['interpersonal or soft skills of the student'] || ''}
                onChange={(e) => handleInputChange('interpersonal or soft skills of the student', e.target.value)}
                placeholder="List your soft skills (communication, leadership, teamwork, etc.)"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Languages Proficiency</label>
              <Textarea
                value={profile['Languages the student can speak, understand, or is proficient i'] || ''}
                onChange={(e) => handleInputChange('Languages the student can speak, understand, or is proficient i', e.target.value)}
                placeholder="Languages you can speak, understand, or are proficient in"
                rows={2}
              />
            </div>
          </div>

          {/* Career Goals & Specializations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Career Goals & Specializations</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Desired Job Role/Long-term Career Goal</label>
              <Input
                value={profile['Desired job role or long-term career goal of the student'] || ''}
                onChange={(e) => handleInputChange('Desired job role or long-term career goal of the student', e.target.value)}
                placeholder="Your desired job role or long-term career goal"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Area of Specialization</label>
                <Input
                  value={profile['First area of academic or professional specialization of the st'] || ''}
                  onChange={(e) => handleInputChange('First area of academic or professional specialization of the st', e.target.value)}
                  placeholder="First area of specialization"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Second Area of Specialization</label>
                <Input
                  value={profile['Second area of academic or professional specialization of the s'] || ''}
                  onChange={(e) => handleInputChange('Second area of academic or professional specialization of the s', e.target.value)}
                  placeholder="Second area of specialization"
                />
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Work Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prior Work Experience</label>
                <Select 
                  value={profile['does the student have any prior work experience'] || ''} 
                  onValueChange={(value) => handleInputChange('does the student have any prior work experience', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Do you have prior work experience?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Total Work Experience (months)</label>
                <Input
                  value={profile['total work experience of the student in months'] || ''}
                  onChange={(e) => handleInputChange('total work experience of the student in months', e.target.value)}
                  placeholder="Total work experience in months"
                />
              </div>
            </div>

            {/* First Organization */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium">First Organization</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name</label>
                  <Input
                    value={profile['name of the first organization worked at'] || ''}
                    onChange={(e) => handleInputChange('name of the first organization worked at', e.target.value)}
                    placeholder="First organization name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <Input
                    value={profile['industry of the first organization'] || ''}
                    onChange={(e) => handleInputChange('industry of the first organization', e.target.value)}
                    placeholder="Industry of first organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title/Designation</label>
                  <Input
                    value={profile['job title or designation at first organization'] || ''}
                    onChange={(e) => handleInputChange('job title or designation at first organization', e.target.value)}
                    placeholder="Job title at first organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Domain/Function</label>
                  <Input
                    value={profile['domain or function at first organization'] || ''}
                    onChange={(e) => handleInputChange('domain or function at first organization', e.target.value)}
                    placeholder="Domain/function at first organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (months)</label>
                  <Input
                    value={profile['duration of work experience at first organization in months'] || ''}
                    onChange={(e) => handleInputChange('duration of work experience at first organization in months', e.target.value)}
                    placeholder="Duration in months"
                  />
                </div>
              </div>
            </div>

            {/* Second Organization */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium">Second Organization</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name</label>
                  <Input
                    value={profile['name of the second organization worked at'] || ''}
                    onChange={(e) => handleInputChange('name of the second organization worked at', e.target.value)}
                    placeholder="Second organization name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <Input
                    value={profile['industry of the second organization'] || ''}
                    onChange={(e) => handleInputChange('industry of the second organization', e.target.value)}
                    placeholder="Industry of second organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title/Designation</label>
                  <Input
                    value={profile['job title or designation at second organization'] || ''}
                    onChange={(e) => handleInputChange('job title or designation at second organization', e.target.value)}
                    placeholder="Job title at second organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Domain/Function</label>
                  <Input
                    value={profile['domain or function at second organization'] || ''}
                    onChange={(e) => handleInputChange('domain or function at second organization', e.target.value)}
                    placeholder="Domain/function at second organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (months)</label>
                  <Input
                    value={profile['duration of work experience at second organization in months'] || ''}
                    onChange={(e) => handleInputChange('duration of work experience at second organization in months', e.target.value)}
                    placeholder="Duration in months"
                  />
                </div>
              </div>
            </div>

            {/* Third Organization */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium">Third Organization</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name</label>
                  <Input
                    value={profile['name of the third organization worked at'] || ''}
                    onChange={(e) => handleInputChange('name of the third organization worked at', e.target.value)}
                    placeholder="Third organization name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <Input
                    value={profile['industry of the third organization'] || ''}
                    onChange={(e) => handleInputChange('industry of the third organization', e.target.value)}
                    placeholder="Industry of third organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title/Designation</label>
                  <Input
                    value={profile['job title or designation at third organization'] || ''}
                    onChange={(e) => handleInputChange('job title or designation at third organization', e.target.value)}
                    placeholder="Job title at third organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Domain/Function</label>
                  <Input
                    value={profile['domain or function at third organization'] || ''}
                    onChange={(e) => handleInputChange('domain or function at third organization', e.target.value)}
                    placeholder="Domain/function at third organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (months)</label>
                  <Input
                    value={profile['duration of work experience at third organization in months'] || ''}
                    onChange={(e) => handleInputChange('duration of work experience at third organization in months', e.target.value)}
                    placeholder="Duration in months"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Gaps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Academic Gaps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Academic Career Gaps</label>
                <Select 
                  value={profile['did the student have any gaps in academic career'] || ''} 
                  onValueChange={(value) => handleInputChange('did the student have any gaps in academic career', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any gaps in academic career?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration of Academic Gap (months)</label>
                <Input
                  value={profile['duration of academic gap in months'] || ''}
                  onChange={(e) => handleInputChange('duration of academic gap in months', e.target.value)}
                  placeholder="Duration of academic gap in months"
                />
              </div>
            </div>
          </div>

          {/* Summer Internship */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Summer Internship</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Summer Internship Organization</label>
                <Input
                  value={profile['Name of the organization where the student completed their summ'] || ''}
                  onChange={(e) => handleInputChange('Name of the organization where the student completed their summ', e.target.value)}
                  placeholder="Organization name for summer internship"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role/Profile during Summer Internship</label>
                <Input
                  value={profile['Role or profile undertaken by the student during their summer i'] || ''}
                  onChange={(e) => handleInputChange('Role or profile undertaken by the student during their summer i', e.target.value)}
                  placeholder="Role during summer internship"
                />
              </div>
            </div>
          </div>

          {/* Resume Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Resume Information</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Resume URL</label>
              <Input
                value={profile.resume_url || ''}
                onChange={(e) => handleInputChange('resume_url', e.target.value)}
                placeholder="Resume URL"
                type="url"
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Complete Profile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
