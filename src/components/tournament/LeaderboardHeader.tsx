import React from 'react';
import { Trophy } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const LeaderboardHeader = () => {
  return (
    <>
      <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
        <Trophy className="text-gaming-accent" />
        Tournament Standings
      </h2>
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
    </>
  );
};

export default LeaderboardHeader;