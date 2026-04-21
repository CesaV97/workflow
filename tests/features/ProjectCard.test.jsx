import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectCard } from '../../src/features/Dashboard/ProjectCard';

const mockProject = {
  id: '1',
  name: 'My Project',
  description: 'A test project',
  status: 'Active',
  endDate: '2026-12-31',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('ProjectCard', () => {
  it('renders project name and status', () => {
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('My Project')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders project description', () => {
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('A test project')).toBeInTheDocument();
  });

  it('does not render description when empty', () => {
    const project = { ...mockProject, description: '' };
    render(<ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText('A test project')).not.toBeInTheDocument();
  });

  it('shows edit/delete buttons on hover', async () => {
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const card = screen.getByText('My Project').closest('.project-card');
    await userEvent.hover(card);
    expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument();
  });

  it('calls onEdit with project when Edit button is clicked', async () => {
    const onEdit = vi.fn();
    render(<ProjectCard project={mockProject} onEdit={onEdit} onDelete={vi.fn()} />);
    await userEvent.hover(screen.getByText('My Project').closest('.project-card'));
    await userEvent.click(screen.getByRole('button', { name: /editar/i }));
    expect(onEdit).toHaveBeenCalledWith(mockProject);
  });

  it('shows confirm/cancel buttons after clicking Eliminar', async () => {
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={vi.fn()} />);
    await userEvent.hover(screen.getByText('My Project').closest('.project-card'));
    await userEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('calls onDelete with project id when Confirm is clicked', async () => {
    const onDelete = vi.fn();
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={onDelete} />);
    await userEvent.hover(screen.getByText('My Project').closest('.project-card'));
    await userEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
