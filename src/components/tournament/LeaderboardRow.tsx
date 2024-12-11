import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardRowProps {
  entry: {
    username: string;
    wins: number;
    losses: number;
    points: number;
    matches_played: number;
    win_rate: number;
  };
  index: number;
}

const LeaderboardRow = ({ entry, index }: LeaderboardRowProps) => {
  return (
    <TableRow>
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
  );
};

export default LeaderboardRow;