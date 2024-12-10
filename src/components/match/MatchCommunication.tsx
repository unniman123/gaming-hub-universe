import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MatchChat from './MatchChat';
import DisputeForm from '../dispute/DisputeForm';

interface MatchCommunicationProps {
  matchId: string;
  player1Username: string;
  player2Username: string;
  isParticipant: boolean;
  opponentId: string | undefined;
}

const MatchCommunication = ({
  matchId,
  player1Username,
  player2Username,
  isParticipant,
  opponentId
}: MatchCommunicationProps) => {
  const handleDisputeCreated = () => {
    // Invalidate disputes query
  };

  return (
    <div className="space-y-8">
      <MatchChat
        matchId={matchId}
        player1Username={player1Username}
        player2Username={player2Username}
      />

      {isParticipant && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-red-500 hover:bg-red-600">
              Report Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gaming-dark border-gaming-accent/20">
            <DialogHeader>
              <DialogTitle className="text-white">Report Match Issue</DialogTitle>
            </DialogHeader>
            <DisputeForm
              matchId={matchId}
              againstId={opponentId}
              onDisputeCreated={handleDisputeCreated}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MatchCommunication;