import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar } from "lucide-react";
import { format } from 'date-fns';

interface TournamentDetailsHeaderProps {
  title: string;
  description: string;
  prizePool: number;
  participantCount: number;
  maxParticipants: number;
  startDate: string;
}

const TournamentDetailsHeader = ({
  title,
  description,
  prizePool,
  participantCount,
  maxParticipants,
  startDate
}: TournamentDetailsHeaderProps) => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Trophy className="text-gaming-accent" />
          {title}
        </h1>
        <p className="text-gray-400 mt-2">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gaming-dark/50 border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="text-gaming-accent" />
              Prize Pool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gaming-accent">
              ${prizePool}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gaming-dark/50 border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="text-gaming-accent" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">
              {participantCount}/{maxParticipants}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gaming-dark/50 border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="text-gaming-accent" />
              Start Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">
              {format(new Date(startDate), 'MMM dd, yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TournamentDetailsHeader;