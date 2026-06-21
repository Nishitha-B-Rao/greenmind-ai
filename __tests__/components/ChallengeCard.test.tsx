import { render, screen } from '@testing-library/react';
import { ChallengeCard } from '@/app/dashboard/components/ChallengeCard';

// Mock the useAuth hook
jest.mock('@/components/AuthContext', () => ({
  useAuth: () => ({
    user: { getIdToken: jest.fn().mockResolvedValue('fake-token') }
  })
}));

describe('ChallengeCard Component', () => {
  it('renders the active challenge if one is provided', () => {
    const mockChallenge = {
      _id: '123',
      title: 'Eat Plant-Based',
      description: 'Go vegetarian for a day.',
      status: 'accepted'
    };

    render(<ChallengeCard activeChallenge={mockChallenge} />);

    expect(screen.getByText('Eat Plant-Based')).toBeInTheDocument();
    expect(screen.getByText('Go vegetarian for a day.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mark as completed/i })).toBeInTheDocument();
  });

  it('renders the generate challenge state when no challenge is active', () => {
    render(<ChallengeCard activeChallenge={null} />);

    expect(screen.getByText(/You don't have an active challenge/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate challenge/i })).toBeInTheDocument();
  });
});
