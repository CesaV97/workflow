import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopBar } from '../../src/features/Layout/TopBar';

describe('TopBar component', () => {
  it('should render topbar container', () => {
    render(<TopBar title="Dashboard" />);
    const topbar = screen.getByRole('banner');
    expect(topbar).toBeInTheDocument();
  });

  it('should render with correct CSS class', () => {
    render(<TopBar title="Dashboard" />);
    const topbar = screen.getByRole('banner');
    expect(topbar).toHaveClass('topbar');
  });

  it('should render search input', () => {
    render(<TopBar title="Dashboard" />);
    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should render search input with correct placeholder', () => {
    render(<TopBar title="Dashboard" />);
    const searchInput = screen.getByPlaceholderText('Buscar proyectos o tareas...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should render nuevo button', () => {
    render(<TopBar title="Dashboard" />);
    expect(screen.getByText('+ Nuevo')).toBeInTheDocument();
  });

  it('should have correct semantic structure', () => {
    const { container } = render(<TopBar title="Dashboard" />);
    const header = container.querySelector('header.topbar');
    expect(header).toBeInTheDocument();
    const searchDiv = header.querySelector('.topbar-search');
    expect(searchDiv).toBeInTheDocument();
  });
});
