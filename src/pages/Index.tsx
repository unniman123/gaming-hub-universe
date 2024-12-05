import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TournamentCard from '@/components/TournamentCard';

const Index = () => {
  const tournaments = [
    {
      title: "PUBG Masters League",
      game: "PUBG Mobile",
      prize: "$10,000",
      players: "128",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
    },
    {
      title: "Fortnite Championship",
      game: "Fortnite",
      prize: "$5,000",
      players: "64",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80",
    },
    {
      title: "CS:GO Elite Series",
      game: "CS:GO",
      prize: "$15,000",
      players: "32",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      <Navbar />
      <Hero />
      
      {/* Featured Tournaments */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Tournaments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament, index) => (
            <TournamentCard key={index} {...tournament} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;