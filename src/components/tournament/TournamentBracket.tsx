import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import BracketMatch from './BracketMatch';

interface Player {
  id: string;
  username: string;
}

interface Match {
  id: string;
  player1: Player;
  player2: Player;
  winner_id: string | null;
  score_player1: number | null;
  score_player2: number | null;
  round: number;
}

interface TournamentBracketProps {
  tournamentId: string;
  onMatchClick: (matchId: string) => void;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ tournamentId, onMatchClick }) => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['tournament-matches', tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          round,
          score_player1,
          score_player2,
          winner_id,
          player1:profiles!matches_player1_id_fkey(id, username),
          player2:profiles!matches_player2_id_fkey(id, username)
        `)
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true });

      if (error) throw error;
      return data as Match[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gaming-accent" />
      </div>
    );
  }

  const rounds = matches?.reduce((acc: { [key: number]: Match[] }, match) => {
    const round = match.round;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8 p-4 min-w-max">
        {rounds && Object.entries(rounds).map(([round, matches]) => (
          <div key={round} className="space-y-4">
            <h3 className="text-white font-semibold text-center">
              Round {round}
            </h3>
            <div className="space-y-8">
              {matches.map((match) => (
                <BracketMatch
                  key={match.id}
                  player1={match.player1?.username || 'TBD'}
                  player2={match.player2?.username || 'TBD'}
                  score1={match.score_player1}
                  score2={match.score_player2}
                  winnerId={match.winner_id}
                  player1Id={match.player1?.id}
                  player2Id={match.player2?.id}
                  onClick={() => onMatchClick(match.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentBracket;