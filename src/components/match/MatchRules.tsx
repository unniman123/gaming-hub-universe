import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Scale, Clock, AlertTriangle } from "lucide-react";

interface MatchRulesProps {
  timeLimit: string;
  tournamentRules: string;
  disputeRules: string;
}

const MatchRules = ({ timeLimit, tournamentRules, disputeRules }: MatchRulesProps) => {
  return (
    <Card className="bg-gaming-dark/50 border-gaming-accent/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Scale className="text-gaming-accent" />
          Match Rules & Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="text-gaming-accent h-5 w-5" />
            Time Limit
          </h3>
          <p className="text-gray-300">{timeLimit}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Tournament Rules</h3>
          <ScrollArea className="h-32 rounded-md border border-gaming-accent/20 p-4">
            <p className="text-gray-300 whitespace-pre-line">{tournamentRules}</p>
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="text-gaming-accent h-5 w-5" />
            Dispute Resolution
          </h3>
          <ScrollArea className="h-32 rounded-md border border-gaming-accent/20 p-4">
            <p className="text-gray-300 whitespace-pre-line">{disputeRules}</p>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchRules;