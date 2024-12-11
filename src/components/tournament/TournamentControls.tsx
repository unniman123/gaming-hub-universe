import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Award } from "lucide-react";
import { generateTournamentMatches, distributePrizes } from "@/utils/tournamentUtils";
import { toast } from "sonner";

interface TournamentControlsProps {
  tournamentId: string;
  status: string;
  onUpdate?: () => void;
}

const TournamentControls = ({ tournamentId, status, onUpdate }: TournamentControlsProps) => {
  const handleStartTournament = async () => {
    try {
      await generateTournamentMatches(tournamentId);
      toast.success("Tournament started successfully");
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to start tournament");
      console.error(error);
    }
  };

  const handleDistributePrizes = async () => {
    try {
      await distributePrizes(tournamentId);
      toast.success("Prizes distributed successfully");
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to distribute prizes");
      console.error(error);
    }
  };

  return (
    <div className="flex gap-2">
      {status === 'upcoming' && (
        <Button onClick={handleStartTournament}>
          <Play className="w-4 h-4 mr-2" />
          Start Tournament
        </Button>
      )}
      {status === 'completed' && !status.prize_distributed && (
        <Button onClick={handleDistributePrizes}>
          <Award className="w-4 h-4 mr-2" />
          Distribute Prizes
        </Button>
      )}
    </div>
  );
};

export default TournamentControls;