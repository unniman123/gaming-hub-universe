import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import TournamentCard from '../TournamentCard';

describe('TournamentCard', () => {
  it('renders tournament information correctly', () => {
    const props = {
      title: 'Test Tournament',
      game: 'Test Game',
      prizePool: 1000,
      entryFee: 50,
      playersJoined: 5,
      maxPlayers: 10,
    };

    renderWithProviders(<TournamentCard {...props} />);

    expect(screen.getByText('Test Tournament')).toBeInTheDocument();
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('Prize Pool: $1000')).toBeInTheDocument();
    expect(screen.getByText('Entry Fee: $50')).toBeInTheDocument();
    expect(screen.getByText('5/10 Players')).toBeInTheDocument();
  });
});