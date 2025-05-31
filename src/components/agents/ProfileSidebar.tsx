
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileSidebarProps {
  profile: any;
}

export const ProfileSidebar = ({ profile }: ProfileSidebarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Data</CardTitle>
      </CardHeader>
      <CardContent>
        {profile ? (
          <div className="space-y-2 text-sm">
            <div><strong>Name:</strong> {profile.name || 'Not set'}</div>
            <div><strong>Email:</strong> {profile.email || 'Not set'}</div>
            <div><strong>Skills:</strong> {profile['technical skills of the student'] || 'Not set'}</div>
            <div><strong>Education:</strong> {profile['type of degree obtained during graduation'] || 'Not set'}</div>
            <div><strong>Experience:</strong> {profile['total work experience of the student in months'] || '0'} months</div>
          </div>
        ) : (
          <p className="text-gray-500">No profile data available</p>
        )}
      </CardContent>
    </Card>
  );
};
