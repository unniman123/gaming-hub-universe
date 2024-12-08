import React from 'react';
import { Trophy } from "lucide-react";
import TournamentCard from '@/components/TournamentCard';

interface Tournament {
  id: string;
  title: string;
  game_type: string;
  prize_pool: number;
  max_participants: number;
  tournament_participants: { count: number }[];
}

interface ActiveTournamentsProps {
  tournaments?: Tournament[];
  isLoading: boolean;
}

const ActiveTournaments = ({ tournaments, isLoading }: ActiveTournamentsProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="text-gaming-accent" />
        Active Tournaments
      </h2>
      
      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading tournaments...</div>
      ) : tournaments?.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No active tournaments</div>
      ) : (
        <div className="space-y-4">
          {tournaments?.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              title={tournament.title}
              game={tournament.game_type}
              prizePool={Number(tournament.prize_pool) || 0}
              entryFee={0}
              playersJoined={tournament.tournament_participants[0].count}
              maxPlayers={tournament.max_participants}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveTournaments;