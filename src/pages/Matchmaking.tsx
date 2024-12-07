import React, { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { Users, Loader, UserRound, X } from "lucide-react";
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Matchmaking = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  const [isSearching, setIsSearching] = useState(false);
  const userId = session?.user?.id;

  // Get current user's profile and matchmaking status
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  // Mutation to update matchmaking status
  const updateMatchmakingStatus = useMutation({
    mutationFn: async (isSearching: boolean) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_in_matchmaking: isSearching })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('Error updating matchmaking status:', error);
      toast.error("Failed to update matchmaking status");
    }
  });

  // Function to find a match
  const findMatch = async () => {
    try {
      const { data: matchedPlayerId, error } = await supabase
        .rpc('find_match', { player_id: userId });

      if (error) throw error;

      if (matchedPlayerId) {
        const { data: match, error: matchError } = await supabase
          .rpc('create_match', { 
            player1_id: userId, 
            player2_id: matchedPlayerId 
          });

        if (matchError) throw matchError;

        toast.success("Match found! Game starting soon...");
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Error finding match:', error);
    }
  };

  // Poll for matches when in matchmaking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSearching && userId) {
      interval = setInterval(findMatch, 5000); // Check every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSearching, userId]);

  // Handle entering/leaving matchmaking queue
  const handleMatchmaking = async () => {
    const newStatus = !isSearching;
    setIsSearching(newStatus);
    await updateMatchmakingStatus.mutateAsync(newStatus);
    
    if (newStatus) {
      toast.success("Entered matchmaking queue");
    } else {
      toast.info("Left matchmaking queue");
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gaming-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 flex justify-center">
          <Loader className="animate-spin text-gaming-accent" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Quick Match</h1>
          
          <div className="bg-gaming-dark/50 border border-gaming-accent/20 rounded-lg p-8 mb-8">
            {profile && (
              <div className="mb-6">
                <UserRound className="w-16 h-16 mx-auto mb-4 text-gaming-accent" />
                <p className="text-gray-300">
                  Skill Rating: {profile.skill_rating}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <Button 
                onClick={handleMatchmaking}
                className={`w-full ${
                  isSearching 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-gaming-accent hover:bg-gaming-accent/90"
                } text-gaming-dark`}
                disabled={updateMatchmakingStatus.isPending}
              >
                {isSearching ? (
                  <>
                    <X className="mr-2" />
                    Cancel Search
                  </>
                ) : (
                  <>
                    <Users className="mr-2" />
                    Find Match
                  </>
                )}
              </Button>
              
              {isSearching && (
                <div className="flex items-center justify-center gap-2 text-gaming-accent">
                  <Loader className="animate-spin" />
                  <span>Searching for opponents...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;