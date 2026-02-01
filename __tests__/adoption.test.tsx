import { render, screen } from '@testing-library/react';
import AdoptPageClient from '../components/AdoptPageClient';

describe('AdoptPageClient', () => {
  it('renders main title', () => {
    render(<AdoptPageClient trees={[]} />);
    expect(screen.getByText(/Choose Your Tree Now/i)).toBeInTheDocument();
  });

  it('shows selection message when no tree is selected', () => {
    render(<AdoptPageClient trees={[]} />);
    expect(screen.getByText(/Select a tree/i)).toBeInTheDocument();
  });
  });
});
