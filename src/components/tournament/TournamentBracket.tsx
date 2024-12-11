import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Match {
  id: string;
  player1: { username: string };
  player2: { username: string };
  winner_id: string | null;
  score_player1: number | null;
  score_player2: number | null;
  round: number;
}

interface BracketMatchProps {
  match: Match;
  onClick: (matchId: string) => void;
}

const BracketMatch: React.FC<BracketMatchProps> = ({ match, onClick }) => {
  return (
    <Card 
      className="p-4 bg-gaming-dark/50 border-gaming-accent/20 cursor-pointer hover:border-gaming-accent transition-colors"
      onClick={() => onClick(match.id)}
    >
      <div className="space-y-2">
        <div className={`flex justify-between items-center ${match.winner_id === match.player1?.id ? 'text-gaming-accent' : 'text-white'}`}>
          <span>{match.player1?.username || 'TBD'}</span>
          <span>{match.score_player1 ?? '-'}</span>
        </div>
        <div className={`flex justify-between items-center ${match.winner_id === match.player2?.id ? 'text-gaming-accent' : 'text-white'}`}>
          <span>{match.player2?.username || 'TBD'}</span>
          <span>{match.score_player2 ?? '-'}</span>
        </div>
      </div>
    </Card>
  );
};

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
          player1:profiles!matches_player1_id_fkey(username),
          player2:profiles!matches_player2_id_fkey(username)
        `)
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true });

      if (error) throw error;
      return data;
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
    const round = match.round || 1;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match as Match);
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
                  match={match}
                  onClick={onMatchClick}
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