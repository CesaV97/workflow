import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from '../../src/features/Layout/Sidebar';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ user: { email: 'test@example.com' } }),
}));

describe('Sidebar component', () => {
  it('should render sidebar container', () => {
    render(<Sidebar onNavigate={vi.fn()} currentView="dashboard" />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should display app title', () => {
    render(<Sidebar onNavigate={vi.fn()} currentView="dashboard" />);
    expect(screen.getByText('Task Flow')).toBeInTheDocument();
  });

  it('should have all 5 navigation items', () => {
    render(<Sidebar onNavigate={vi.fn()} currentView="dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Proyectos')).toBeInTheDocument();
    expect(screen.getByText('Tareas')).toBeInTheDocument();
    expect(screen.getByText('Reportes')).toBeInTheDocument();
    expect(screen.getByText('Configuración')).toBeInTheDocument();
  });

  it('should apply active class to current view', () => {
    render(<Sidebar onNavigate={vi.fn()} currentView="projects" />);
    const activeItem = screen.getByText('Proyectos').closest('button');
    expect(activeItem).toHaveClass('active');
  });

  it('should call onNavigate with correct id when item clicked', async () => {
    const onNavigate = vi.fn();
    render(<Sidebar onNavigate={onNavigate} currentView="dashboard" />);
    await userEvent.click(screen.getByText('Proyectos'));
    expect(onNavigate).toHaveBeenCalledWith('projects');
  });

  it('should render at least 5 nav list items', () => {
    const { container } = render(<Sidebar onNavigate={vi.fn()} currentView="dashboard" />);
    const listItems = container.querySelectorAll('.sidebar-nav li');
    expect(listItems.length).toBeGreaterThanOrEqual(5);
  });
});
