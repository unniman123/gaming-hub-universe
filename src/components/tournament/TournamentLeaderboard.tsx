import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import LeaderboardHeader from './LeaderboardHeader';
import LeaderboardRow from './LeaderboardRow';

interface LeaderboardEntry {
  tournament_id: string;
  player_id: string;
  username: string;
  wins: number;
  losses: number;
  points: number;
  matches_played: number;
  win_rate: number;
}

interface TournamentLeaderboardProps {
  tournamentId: string;
  isFinished: boolean;
}

const TournamentLeaderboard = ({ tournamentId, isFinished }: TournamentLeaderboardProps) => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['tournament-leaderboard', tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournament_participants')
        .select(`
          tournament_id,
          player_id,
          wins,
          losses,
          points,
          matches_played,
          profiles (
            username
          )
        `)
        .eq('tournament_id', tournamentId)
        .order('points', { ascending: false });

      if (error) throw error;

      return data.map(entry => ({
        tournament_id: entry.tournament_id,
        player_id: entry.player_id,
        username: entry.profiles.username,
        wins: entry.wins || 0,
        losses: entry.losses || 0,
        points: entry.points || 0,
        matches_played: entry.matches_played || 0,
        win_rate: entry.matches_played > 0 
          ? Math.round((entry.wins / entry.matches_played) * 100) 
          : 0
      }));
    },
    enabled: !!tournamentId,
  });

  if (isLoading) {
    return <div className="text-center p-4">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-gaming-dark/50 rounded-lg border border-gaming-accent/20">
        <Table>
          <LeaderboardHeader />
          <TableBody>
            {leaderboard?.map((entry, index) => (
              <LeaderboardRow 
                key={entry.player_id} 
                entry={entry} 
                index={index}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TournamentLeaderboard;