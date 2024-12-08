import React from 'react';
import { History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Match {
  id: string;
  player1: { username: string };
  player2: { username: string };
  score_player1: number;
  score_player2: number;
  status: string;
}

interface MatchHistoryProps {
  matches?: Match[];
  isLoading: boolean;
}

const MatchHistory = ({ matches, isLoading }: MatchHistoryProps) => {
  return (
    <Card className="bg-gaming-dark/50 border-gaming-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="text-gaming-accent" />
          Recent Matches
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading matches...</div>
        ) : matches?.length === 0 ? (
          <div className="text-center py-4 text-gray-400">No matches found</div>
        ) : (
          <div className="space-y-4">
            {matches?.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gaming-dark/30 border border-gaming-accent/10"
              >
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    {match.player1.username} vs {match.player2.username}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    {match.score_player1} - {match.score_player2}
                  </div>
                  <div className={`text-sm px-2 py-1 rounded ${
                    match.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {match.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchHistory;