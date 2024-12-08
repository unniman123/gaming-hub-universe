import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { toast } from "sonner";
import { ArrowLeft, Trophy, Swords, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Match = Database['public']['Tables']['matches']['Row'] & {
  player1: { username: string; skill_rating: number };
  player2: { username: string; skill_rating: number };
};

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const queryClient = useQueryClient();

  const { data: match, isLoading } = useQuery({
    queryKey: ['match', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          player1:profiles!matches_player1_id_fkey(username, skill_rating),
          player2:profiles!matches_player2_id_fkey(username, skill_rating)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Match;
    },
    enabled: !!id,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel('match_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log('Match update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['match', id] });
          
          const oldRow = payload.old as Database['public']['Tables']['matches']['Row'];
          const newRow = payload.new as Database['public']['Tables']['matches']['Row'];
          
          // Show toast notification for status changes
          if (newRow.status !== oldRow?.status) {
            toast.info(`Match status updated to: ${newRow.status}`);
          }
          
          // Show toast notification for score updates
          if (newRow.score_player1 !== oldRow?.score_player1 || 
              newRow.score_player2 !== oldRow?.score_player2) {
            toast.info('Match scores have been updated');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  const updateMatchMutation = useMutation({
    mutationFn: async ({ score1, score2 }: { score1: number; score2: number }) => {
      const winnerId = score1 > score2 ? match?.player1_id : match?.player2_id;
      
      const { error } = await supabase
        .from('matches')
        .update({
          score_player1: score1,
          score_player2: score2,
          winner_id: winnerId,
          status: 'completed'
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match', id] });
      toast.success('Match results reported successfully!');
    },
    onError: (error) => {
      console.error('Error updating match:', error);
      toast.error('Failed to report match results');
    },
  });

  const handleReportResult = async () => {
    // For this example, we'll use a simple score of 2-1
    // In a real implementation, you'd want a proper form for score input
    await updateMatchMutation.mutateAsync({ score1: 2, score2: 1 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gaming-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          Loading match details...
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gaming-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          Match not found
        </div>
      </div>
    );
  }

  const isParticipant = session?.user?.id === match.player1_id || 
                       session?.user?.id === match.player2_id;

  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>

        <Card className="bg-gaming-dark/50 border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Swords className="text-gaming-accent" />
              Match Details
            </CardTitle>
            <CardDescription>
              Match Status: {match.status}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Player 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {match.player1.username}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Rating: {match.player1.skill_rating}</p>
                  {match.score_player1 !== null && (
                    <p className="text-2xl font-bold mt-2">{match.score_player1}</p>
                  )}
                </CardContent>
              </Card>

              {/* VS Section */}
              <Card className="flex items-center justify-center">
                <CardContent>
                  <div className="text-2xl font-bold">VS</div>
                  {match.status === 'completed' && match.winner_id && (
                    <div className="mt-4 flex items-center gap-2">
                      <Trophy className="text-gaming-accent" />
                      Winner: {
                        match.winner_id === match.player1_id 
                          ? match.player1.username 
                          : match.player2.username
                      }
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Player 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {match.player2.username}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Rating: {match.player2.skill_rating}</p>
                  {match.score_player2 !== null && (
                    <p className="text-2xl font-bold mt-2">{match.score_player2}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {isParticipant && match.status === 'in_progress' && (
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={handleReportResult}
                  disabled={updateMatchMutation.isPending}
                >
                  Report Match Result
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchDetails;