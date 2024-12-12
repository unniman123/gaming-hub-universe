import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from '@/components/Navbar';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [gameId, setGameId] = useState('');
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUsername(data.username);
      setGameId(data.game_id || '');
      return data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (formData: { username: string; game_id: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          game_id: formData.game_id,
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to update avatar');
    }
  };

  const handleSave = () => {
    updateProfile.mutate({ username, game_id: gameId });
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gaming-dark/50 border-gaming-accent/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold">Profile</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="avatar-upload"
                    onChange={handleAvatarUpload}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-0 right-0"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Username</label>
                  {isEditing ? (
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-white">{profile.username}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">Game ID</label>
                  {isEditing ? (
                    <Input
                      value={gameId}
                      onChange={(e) => setGameId(e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-white">{profile.game_id || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">Skill Rating</label>
                  <p className="mt-1 text-white">{profile.skill_rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;