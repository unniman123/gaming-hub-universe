import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import BracketMatch from './BracketMatch';

interface Player {
  id: string;
  username: string;
  game_id: string;
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
          player1:profiles!matches_player1_id_fkey(id, username, game_id),
          player2:profiles!matches_player2_id_fkey(id, username, game_id)
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
                <Card 
                  key={match.id}
                  className="p-4 cursor-pointer hover:bg-gaming-accent/10 transition-colors"
                  onClick={() => onMatchClick(match.id)}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white">{match.player1?.username || 'TBD'}</p>
                        <p className="text-sm text-gray-400">Game ID: {match.player1?.game_id || 'N/A'}</p>
                      </div>
                      <span className="text-gaming-accent">{match.score_player1 || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white">{match.player2?.username || 'TBD'}</p>
                        <p className="text-sm text-gray-400">Game ID: {match.player2?.game_id || 'N/A'}</p>
                      </div>
                      <span className="text-gaming-accent">{match.score_player2 || '-'}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentBracket;