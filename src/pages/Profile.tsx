import React, { useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, User } from "lucide-react";

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
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              )}
            </div>
            <div>
              {isEditing ? (
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mb-2"
                  placeholder="Username"
                />
              ) : (
                <h2 className="text-xl font-semibold text-white">{profile.username}</h2>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Game ID</label>
              {isEditing ? (
                <Input
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  placeholder="Enter your game ID"
                />
              ) : (
                <p className="text-white">{profile.game_id || 'Not set'}</p>
              )}
            </div>

            {profile.skill_rating && (
              <div>
                <label className="text-sm text-gray-400">Skill Rating</label>
                <p className="text-white">{profile.skill_rating}</p>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex space-x-4">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile;