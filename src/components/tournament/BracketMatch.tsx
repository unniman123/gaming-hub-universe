import React from 'react';
import { Card } from "@/components/ui/card";

interface BracketMatchProps {
  player1: string;
  player2: string;
  score1: number | null;
  score2: number | null;
  winnerId: string | null;
  player1Id: string;
  player2Id: string;
  onClick: () => void;
}

const BracketMatch: React.FC<BracketMatchProps> = ({
  player1,
  player2,
  score1,
  score2,
  winnerId,
  player1Id,
  player2Id,
  onClick,
}) => {
  return (
    <Card 
      className="p-4 bg-gaming-dark/50 border-gaming-accent/20 cursor-pointer hover:border-gaming-accent transition-colors"
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className={`flex justify-between items-center ${winnerId === player1Id ? 'text-gaming-accent' : 'text-white'}`}>
          <span>{player1 || 'TBD'}</span>
          <span>{score1 ?? '-'}</span>
        </div>
        <div className={`flex justify-between items-center ${winnerId === player2Id ? 'text-gaming-accent' : 'text-white'}`}>
          <span>{player2 || 'TBD'}</span>
          <span>{score2 ?? '-'}</span>
        </div>
      </div>
    </Card>
  );
};

export default BracketMatch;