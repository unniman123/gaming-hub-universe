import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSessionContext } from '@supabase/auth-helpers-react';
import Navbar from '@/components/Navbar';
import MatchHeader from '@/components/match/MatchHeader';
import MatchContainer from '@/components/match/MatchContainer';
import { supabase } from "@/integrations/supabase/client";

const MatchDetails = () => {
  const { id } = useParams();
  const { session } = useSessionContext();

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

  const opponentId = session?.user?.id === match.player1_id 
    ? match.player2_id 
    : match.player1_id;

  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <MatchHeader />
        <MatchContainer
          match={match}
          isParticipant={isParticipant}
          opponentId={opponentId}
        />
      </div>
    </div>
  );
};

export default MatchDetails;