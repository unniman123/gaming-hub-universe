import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import MatchInfo from '@/components/match/MatchInfo';
import MatchChat from '@/components/match/MatchChat';
import MatchRules from '@/components/match/MatchRules';
import { supabase } from "@/integrations/supabase/client";

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
          player2:profiles!matches_player2_id_fkey(username, skill_rating),
          tournaments(
            match_time_limit,
            tournament_rules,
            dispute_resolution_rules
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
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
        () => {
          queryClient.invalidateQueries({ queryKey: ['match', id] });
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

        <div className="space-y-8">
          <MatchInfo
            player1={match.player1}
            player2={match.player2}
            score1={match.score_player1}
            score2={match.score_player2}
            winnerId={match.winner_id}
            player1Id={match.player1_id}
            player2Id={match.player2_id}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <MatchChat
              matchId={match.id}
              player1Username={match.player1.username}
              player2Username={match.player2.username}
            />

            <div className="space-y-8">
              <MatchRules
                timeLimit={match.tournaments?.match_time_limit || '30 minutes'}
                tournamentRules={match.tournaments?.tournament_rules || 'No specific rules provided.'}
                disputeRules={match.tournaments?.dispute_resolution_rules || 'Contact tournament admin for dispute resolution.'}
              />

              {isParticipant && match.status === 'in_progress' && (
                <Button 
                  onClick={handleReportResult}
                  disabled={updateMatchMutation.isPending}
                  className="w-full bg-gaming-accent hover:bg-gaming-accent/80"
                >
                  Report Match Result
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;