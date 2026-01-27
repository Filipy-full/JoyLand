import { render, screen } from '@testing-library/react';
import AdoptPageClient from '../components/AdoptPageClient';

describe('AdoptPageClient', () => {
  it('renderiza título principal', () => {
    render(<AdoptPageClient trees={[]} />);
    expect(screen.getByText(/Elige Tu Árbol Ahora/i)).toBeInTheDocument();
  });

  it('mostra mensagem de seleção quando nenhum árvore está selecionada', () => {
    render(<AdoptPageClient trees={[]} />);
    expect(screen.getByText(/Selecciona un árbol/i)).toBeInTheDocument();
  });
});
