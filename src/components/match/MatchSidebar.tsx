import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ScrollText } from "lucide-react";
import ScoreSubmission from './ScoreSubmission';
import MatchRules from './MatchRules';

interface MatchSidebarProps {
  matchId: string;
  isParticipant: boolean;
  tournament?: {
    title: string;
    tournament_rules?: string | null;
  } | null;
  player1Id: string;
  player2Id: string;
  currentStatus: string;
}

const MatchSidebar = ({ 
  matchId, 
  isParticipant, 
  tournament,
  player1Id,
  player2Id,
  currentStatus
}: MatchSidebarProps) => {
  return (
    <div className="space-y-4">
      {tournament && (
        <Card className="bg-gaming-dark/50 border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gaming-accent" />
              Tournament Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">{tournament.title}</p>
          </CardContent>
        </Card>
      )}

      <ScoreSubmission
        matchId={matchId}
        player1Id={player1Id}
        player2Id={player2Id}
        isParticipant={isParticipant}
        currentStatus={currentStatus}
      />

      {tournament?.tournament_rules && (
        <Card className="bg-gaming-dark/50 border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-gaming-accent" />
              Tournament Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MatchRules rules={tournament.tournament_rules} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchSidebar;