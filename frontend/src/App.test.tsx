import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders the AI Quiz Generator brand name', () => {
    render(<App />);
    // The brand name appears in the Header nav link
    const brandLinks = screen.getAllByRole('link', { name: /AI Quiz Generator/i });
    expect(brandLinks.length).toBeGreaterThan(0);
  });

  it('renders the hero heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /Turn Your Study Notes/i }),
    ).toBeInTheDocument();
  });

  it('renders the Create a New Quiz section', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /Create a New Quiz/i }),
    ).toBeInTheDocument();
  });

  it('renders input mode tabs', () => {
    render(<App />);
    expect(screen.getByRole('tab', { name: /Paste Notes/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Upload PDF/i })).toBeInTheDocument();
  });

  it('renders the Generate Quiz button', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /Generate Quiz/i }),
    ).toBeInTheDocument();
  });
});
