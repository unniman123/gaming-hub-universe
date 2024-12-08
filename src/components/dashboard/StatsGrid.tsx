import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Trophy, Swords, Target, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface StatsGridProps {
  userStats: any;
  statsLoading: boolean;
  matchesCount: number;
  matchesLoading: boolean;
}

const StatsGrid = ({ userStats, statsLoading, matchesCount, matchesLoading }: StatsGridProps) => {
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const { data: matchmakingStatus, isLoading: matchmakingLoading } = useQuery({
    queryKey: ['matchmaking-status', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_in_matchmaking')
        .eq('id', session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
    refetchInterval: 5000, // Refresh every 5 seconds while in matchmaking
  });

  const handleMatchmakingClick = () => {
    navigate('/matchmaking');
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Skill Rating</CardTitle>
          <Trophy className="h-4 w-4 text-gaming-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statsLoading ? "..." : userStats?.skill_rating || 1000}</div>
          <p className="text-xs text-muted-foreground">
            Your current rating
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
          <Swords className="h-4 w-4 text-gaming-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{matchesLoading ? "..." : matchesCount}</div>
          <p className="text-xs text-muted-foreground">
            Matches played
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:border-gaming-accent transition-colors"
        onClick={handleMatchmakingClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Matchmaking</CardTitle>
          <Target className="h-4 w-4 text-gaming-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {matchmakingLoading ? "..." : 
              matchmakingStatus?.is_in_matchmaking ? "In Queue" : "Ready"
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {matchmakingStatus?.is_in_matchmaking ? 
              "Finding a match..." : 
              "Click to find a match"
            }
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Players</CardTitle>
          <Users className="h-4 w-4 text-gaming-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <Button 
              variant="link" 
              className="p-0 h-auto font-bold text-2xl"
              onClick={() => navigate('/tournaments')}
            >
              View
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Click to see tournaments
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsGrid;