import React, { useState, useEffect } from 'react';
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { User, Pencil } from "lucide-react";
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { session } = useSessionContext();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: profile, refetch } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setGameId(profile.game_id || "");
    }
  }, [profile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      let avatarUrl = profile?.avatar_url;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${session?.user?.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          game_id: gameId,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session?.user?.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gaming-dark/50 border border-gaming-accent/20 rounded-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
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
                      onChange={handleFileChange}
                      className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
                    />
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gaming-dark/30 border-gaming-accent/20"
                      />
                    </div>
                  ) : (
                    <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                  )}
                  <p className="text-gray-300">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent/20"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="border-red-500 text-red-500 hover:bg-red-500/20"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="bg-gaming-accent hover:bg-gaming-accent/80"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gameId">Game ID</Label>
                  <Input
                    id="gameId"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    placeholder="Enter your game ID"
                    className="bg-gaming-dark/30 border-gaming-accent/20"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gaming-dark/30 p-4 rounded-lg border border-gaming-accent/10">
                  <h3 className="text-white font-semibold mb-2">Game ID</h3>
                  <p className="text-gray-300">{profile.game_id || "Not set"}</p>
                </div>
                <div className="bg-gaming-dark/30 p-4 rounded-lg border border-gaming-accent/10">
                  <h3 className="text-white font-semibold mb-2">Skill Rating</h3>
                  <p className="text-gray-300">{profile.skill_rating}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;