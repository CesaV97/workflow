import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopBar } from '../../src/features/Layout/TopBar';

const props = {
  userEmail: 'user@example.com',
  onSignOut: () => {},
  onNavigate: () => {},
};

describe('TopBar component', () => {
  it('should render topbar container', () => {
    render(<TopBar {...props} />);
    const topbar = screen.getByRole('banner');
    expect(topbar).toBeInTheDocument();
  });

  it('should render with correct CSS class', () => {
    render(<TopBar {...props} />);
    const topbar = screen.getByRole('banner');
    expect(topbar).toHaveClass('topbar');
  });

  it('should render search input', () => {
    render(<TopBar {...props} />);
    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should render search input with correct placeholder', () => {
    render(<TopBar {...props} />);
    const searchInput = screen.getByPlaceholderText('Buscar proyectos o tareas...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should render new task button', () => {
    render(<TopBar {...props} />);
    expect(screen.getByText('+ Nueva tarea')).toBeInTheDocument();
  });

  it('should have correct semantic structure', () => {
    const { container } = render(<TopBar {...props} />);
    const header = container.querySelector('header.topbar');
    expect(header).toBeInTheDocument();
    const searchDiv = header.querySelector('.topbar-search');
    expect(searchDiv).toBeInTheDocument();
  });
});
