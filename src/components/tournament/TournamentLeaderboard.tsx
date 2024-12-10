import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Medal } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

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
          profiles:player_id (
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
        wins: entry.wins,
        losses: entry.losses,
        points: entry.points,
        matches_played: entry.matches_played,
        win_rate: entry.matches_played > 0 
          ? Math.round((entry.wins / entry.matches_played) * 100) 
          : 0
      })) as LeaderboardEntry[];
    },
    enabled: !!tournamentId,
  });

  if (isLoading) {
    return <div className="text-center p-4">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Trophy className="text-gaming-accent" />
        Tournament Standings
      </h2>
      
      <div className="bg-gaming-dark/50 rounded-lg border border-gaming-accent/20">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gaming-accent">Rank</TableHead>
              <TableHead className="text-gaming-accent">Player</TableHead>
              <TableHead className="text-gaming-accent text-center">Points</TableHead>
              <TableHead className="text-gaming-accent text-center">W/L</TableHead>
              <TableHead className="text-gaming-accent text-center">Win Rate</TableHead>
              <TableHead className="text-gaming-accent text-center">Matches</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard?.map((entry, index) => (
              <TableRow key={entry.player_id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Trophy className="text-yellow-500 h-4 w-4" />}
                    {index === 1 && <Medal className="text-gray-400 h-4 w-4" />}
                    {index === 2 && <Medal className="text-amber-700 h-4 w-4" />}
                    {index + 1}
                  </div>
                </TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell className="text-center font-bold text-gaming-accent">
                  {entry.points}
                </TableCell>
                <TableCell className="text-center">
                  {entry.wins}/{entry.losses}
                </TableCell>
                <TableCell className="text-center">
                  {entry.win_rate}%
                </TableCell>
                <TableCell className="text-center">
                  {entry.matches_played}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TournamentLeaderboard;