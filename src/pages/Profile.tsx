import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>({});
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
        setIsAdmin(data.role?.name === 'admin');
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

  const handleInputChange = (field: string, value: string) => {
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
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
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
          </div>

          {/* Role Selection - Only for admins */}
          {isAdmin && (
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
          )}

          {/* Current Role Display for non-admins */}
          {!isAdmin && profile.role && (
            <div>
              <label className="block text-sm font-medium mb-2">Your Role</label>
              <Input
                value={`${profile.role.name} - ${profile.role.description}`}
                disabled
                className="bg-gray-100"
              />
            </div>
          )}

          {/* ... keep existing code (date of birth, gender, education sections, skills, etc.) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth</label>
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
          </div>

          {/* Education - Class 10 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Class 10 Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">School Name</label>
                <Input
                  value={profile['name of the school attended for class 10'] || ''}
                  onChange={(e) => handleInputChange('name of the school attended for class 10', e.target.value)}
                  placeholder="School name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Board</label>
                <Input
                  value={profile['education board for class 10'] || ''}
                  onChange={(e) => handleInputChange('education board for class 10', e.target.value)}
                  placeholder="Education board"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Percentage</label>
                <Input
                  value={profile['percentage marks scored in class 10'] || ''}
                  onChange={(e) => handleInputChange('percentage marks scored in class 10', e.target.value)}
                  placeholder="Percentage"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Education - Class 12 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Class 12 Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">School Name</label>
                <Input
                  value={profile['name of the school attended for class 12'] || ''}
                  onChange={(e) => handleInputChange('name of the school attended for class 12', e.target.value)}
                  placeholder="School name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Board</label>
                <Input
                  value={profile['education board for class 12'] || ''}
                  onChange={(e) => handleInputChange('education board for class 12', e.target.value)}
                  placeholder="Education board"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Percentage</label>
                <Input
                  value={profile['percentage marks scored in class 12'] || ''}
                  onChange={(e) => handleInputChange('percentage marks scored in class 12', e.target.value)}
                  placeholder="Percentage"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Graduation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Graduation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">College Name</label>
                <Input
                  value={profile['name of the college attended for graduation'] || ''}
                  onChange={(e) => handleInputChange('name of the college attended for graduation', e.target.value)}
                  placeholder="College name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Degree Type</label>
                <Input
                  value={profile['type of degree obtained during graduation'] || ''}
                  onChange={(e) => handleInputChange('type of degree obtained during graduation', e.target.value)}
                  placeholder="e.g., B.Tech, B.A., B.Com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Specialization</label>
                <Input
                  value={profile['specialization pursued during graduation'] || ''}
                  onChange={(e) => handleInputChange('specialization pursued during graduation', e.target.value)}
                  placeholder="Specialization/Major"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Percentage</label>
                <Input
                  value={profile['percentage marks obtained during graduation'] || ''}
                  onChange={(e) => handleInputChange('percentage marks obtained during graduation', e.target.value)}
                  placeholder="Percentage"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* MBA Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">MBA Details</h3>
            <div>
              <label className="block text-sm font-medium mb-2">CGPA</label>
              <Input
                value={profile['cgpa during mba program'] || ''}
                onChange={(e) => handleInputChange('cgpa during mba program', e.target.value)}
                placeholder="CGPA"
                type="number"
                step="0.01"
              />
            </div>
          </div>

          {/* Skills and Experience */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Technical Skills</label>
              <Textarea
                value={profile['technical skills of the student'] || ''}
                onChange={(e) => handleInputChange('technical skills of the student', e.target.value)}
                placeholder="List your technical skills"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Work Experience (months)</label>
              <Input
                value={profile['total work experience of the student in months'] || ''}
                onChange={(e) => handleInputChange('total work experience of the student in months', e.target.value)}
                placeholder="Total work experience in months"
                type="number"
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
