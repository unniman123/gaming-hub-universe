import React, { useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileActions from '@/components/profile/ProfileActions';

const Profile = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [gameId, setGameId] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();

      if (error) throw error;
      setUsername(data.username || '');
      setGameId(data.game_id || '');
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSave = async () => {
    try {
      let avatarUrl = profile?.avatar_url;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${session?.user?.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username,
          game_id: gameId,
          avatar_url: avatarUrl,
        })
        .eq('id', session?.user?.id);

      if (updateError) throw updateError;

      await refetchProfile();
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6 bg-gaming-dark/50 border-gaming-accent/20">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <ProfileActions
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <ProfileAvatar
              avatarUrl={profile.avatar_url}
              isEditing={isEditing}
              onAvatarChange={handleAvatarChange}
            />
            <div className="flex-1">
              <ProfileForm
                username={username}
                gameId={gameId}
                isEditing={isEditing}
                onUsernameChange={(e) => setUsername(e.target.value)}
                onGameIdChange={(e) => setGameId(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;