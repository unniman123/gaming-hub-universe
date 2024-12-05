import React from 'react';
import { Card } from "@/components/ui/card";

interface TournamentCardProps {
  title: string;
  game: string;
  prize: string;
  players: string;
  image: string;
}

const TournamentCard = ({ title, game, prize, players, image }: TournamentCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-gaming-dark/50 border-gaming-accent/20 hover:border-gaming-accent/50 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark via-transparent to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <div className="flex justify-between text-sm text-gray-300">
          <span>{game}</span>
          <span className="text-gaming-accent">{prize}</span>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          {players} Players Registered
        </div>
      </div>
    </Card>
  );
};

export default TournamentCard;