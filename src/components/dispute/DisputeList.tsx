import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DisputeListProps {
  matchId: string;
  onSelectDispute: (disputeId: string) => void;
}

const DisputeList = ({ matchId, onSelectDispute }: DisputeListProps) => {
  const { data: disputes, isLoading } = useQuery({
    queryKey: ['disputes', matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dispute_cases')
        .select(`
          *,
          reported_by:profiles!dispute_cases_reported_by_id_fkey(username),
          against:profiles!dispute_cases_against_id_fkey(username)
        `)
        .eq('match_id', matchId);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading disputes...</div>;
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 p-4">
        {disputes?.map((dispute) => (
          <Card key={dispute.id} className="bg-gaming-dark/50 border-gaming-accent/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5 text-gaming-accent" />
                {dispute.title}
              </CardTitle>
              <div className="text-sm text-gray-400">
                Reported by {dispute.reported_by.username} against {dispute.against.username}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{dispute.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-sm ${
                  dispute.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                  dispute.status === 'resolved' ? 'bg-green-500/20 text-green-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                </span>
                <Button
                  variant="ghost"
                  className="text-gaming-accent hover:text-gaming-accent/80"
                  onClick={() => onSelectDispute(dispute.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  View Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default DisputeList;