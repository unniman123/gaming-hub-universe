import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import MatchRules from './MatchRules';
import DisputeList from '../dispute/DisputeList';
import DisputeChat from '../dispute/DisputeChat';
import { Tournament } from '@/types/database';

interface MatchSidebarProps {
  matchId: string;
  isParticipant: boolean;
  tournament?: Tournament;
}

const MatchSidebar = ({ matchId, isParticipant, tournament }: MatchSidebarProps) => {
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <MatchRules
        timeLimit={tournament?.match_time_limit?.toString() || '30 minutes'}
        tournamentRules={tournament?.tournament_rules || 'No specific rules provided.'}
        disputeRules={tournament?.dispute_resolution_rules || 'Contact tournament admin for dispute resolution.'}
      />

      {isParticipant && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Match Disputes</h3>
          {selectedDispute ? (
            <>
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => setSelectedDispute(null)}
              >
                Back to Disputes
              </Button>
              <DisputeChat disputeId={selectedDispute} />
            </>
          ) : (
            <DisputeList
              matchId={matchId}
              onSelectDispute={setSelectedDispute}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MatchSidebar;
