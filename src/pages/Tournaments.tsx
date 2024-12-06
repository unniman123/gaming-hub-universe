import React from 'react';
import Navbar from '@/components/Navbar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Trophy, Users, Calendar } from "lucide-react";

const Tournaments = () => {
  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold text-white mb-8">Active Tournaments</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tournament</TableHead>
              <TableHead>Game</TableHead>
              <TableHead>Prize Pool</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Start Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-white">
                <div className="flex items-center gap-2">
                  <Trophy className="text-gaming-accent" />
                  Spring Championship
                </div>
              </TableCell>
              <TableCell className="text-gray-300">Fortnite</TableCell>
              <TableCell className="text-gaming-accent">$10,000</TableCell>
              <TableCell className="text-gray-300">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  32/64
                </div>
              </TableCell>
              <TableCell className="text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Mar 15, 2024
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Tournaments;