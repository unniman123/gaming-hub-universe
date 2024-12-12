import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from '@tanstack/react-query';
import MatchChat from './MatchChat';
import DisputeForm from '../dispute/DisputeForm';
import DisputeList from '../dispute/DisputeList';
import DisputeChat from '../dispute/DisputeChat';

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
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDisputeCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['disputes', matchId] });
  };

  return (
    <div className="space-y-8">
      <MatchChat
        matchId={matchId}
        player1Username={player1Username}
        player2Username={player2Username}
      />

      {isParticipant && !selectedDisputeId && (
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

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Match Disputes</h3>
        {selectedDisputeId ? (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setSelectedDisputeId(null)}
              className="mb-4"
            >
              Back to Disputes List
            </Button>
            <DisputeChat disputeId={selectedDisputeId} />
          </div>
        ) : (
          <DisputeList
            matchId={matchId}
            onSelectDispute={(disputeId) => setSelectedDisputeId(disputeId)}
          />
        )}
      </div>
    </div>
  );
};

export default MatchCommunication;