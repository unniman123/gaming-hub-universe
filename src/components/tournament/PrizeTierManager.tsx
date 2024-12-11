import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PrizeTier {
  position: number;
  percentage: number;
}

interface PrizeTierManagerProps {
  tournamentId: string;
  onUpdate?: () => void;
}

const PrizeTierManager = ({ tournamentId, onUpdate }: PrizeTierManagerProps) => {
  const [tiers, setTiers] = useState<PrizeTier[]>([
    { position: 1, percentage: 50 },
    { position: 2, percentage: 30 },
    { position: 3, percentage: 20 },
  ]);

  const handlePercentageChange = (index: number, value: string) => {
    const newTiers = [...tiers];
    newTiers[index].percentage = Number(value);
    setTiers(newTiers);
  };

  const addTier = () => {
    setTiers([...tiers, { position: tiers.length + 1, percentage: 0 }]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const saveTiers = async () => {
    try {
      // Validate total percentage is 100
      const total = tiers.reduce((sum, tier) => sum + tier.percentage, 0);
      if (total !== 100) {
        toast.error("Total percentage must equal 100%");
        return;
      }

      // Delete existing tiers
      await supabase
        .from('prize_tiers')
        .delete()
        .eq('tournament_id', tournamentId);

      // Insert new tiers
      await supabase
        .from('prize_tiers')
        .insert(
          tiers.map(tier => ({
            tournament_id: tournamentId,
            position: tier.position,
            percentage: tier.percentage
          }))
        );

      toast.success("Prize tiers saved successfully");
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to save prize tiers");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="text-gaming-accent" />
          Prize Tiers
        </h3>
        <Button onClick={addTier} variant="outline">Add Tier</Button>
      </div>

      <div className="space-y-2">
        {tiers.map((tier, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="number"
                value={tier.percentage}
                onChange={(e) => handlePercentageChange(index, e.target.value)}
                placeholder="Percentage"
                min="0"
                max="100"
              />
            </div>
            <Button
              variant="destructive"
              onClick={() => removeTier(index)}
              disabled={tiers.length <= 1}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={saveTiers}>Save Tiers</Button>
      </div>
    </div>
  );
};

export default PrizeTierManager;