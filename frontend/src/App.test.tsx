import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders the AI Quiz Generator header title', () => {
    render(<App />);
    const headingElements = screen.getAllByText('AI Quiz Generator');
    expect(headingElements.length).toBeGreaterThan(0);
  });
});

