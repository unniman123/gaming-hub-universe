import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Trophy } from "lucide-react";

interface MatchInfoProps {
  player1: {
    username: string;
    skill_rating: number;
  };
  player2: {
    username: string;
    skill_rating: number;
  };
  score1: number | null;
  score2: number | null;
  winnerId: string | null;
  player1Id: string;
  player2Id: string;
}

const MatchInfo = ({
  player1,
  player2,
  score1,
  score2,
  winnerId,
  player1Id,
  player2Id,
}: MatchInfoProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Player 1 */}
      <Card className="bg-gaming-dark/50 border-gaming-accent/20">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            {player1.username}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Rating: {player1.skill_rating}</p>
          {score1 !== null && (
            <p className="text-2xl font-bold mt-2 text-white">{score1}</p>
          )}
        </CardContent>
      </Card>

      {/* VS Section */}
      <Card className="bg-gaming-dark/50 border-gaming-accent/20 flex items-center justify-center">
        <CardContent>
          <div className="text-2xl font-bold text-white">VS</div>
          {winnerId && (
            <div className="mt-4 flex items-center gap-2">
              <Trophy className="text-gaming-accent" />
              <span className="text-white">
                Winner: {winnerId === player1Id ? player1.username : player2.username}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player 2 */}
      <Card className="bg-gaming-dark/50 border-gaming-accent/20">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            {player2.username}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Rating: {player2.skill_rating}</p>
          {score2 !== null && (
            <p className="text-2xl font-bold mt-2 text-white">{score2}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchInfo;