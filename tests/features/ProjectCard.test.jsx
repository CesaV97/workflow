import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectCard } from '../../src/features/Dashboard/ProjectCard';

const mockProject = {
  id: '1',
  name: 'My Project',
  description: 'A test project',
  status: 'Active',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
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

  it('renders "Sin descripción" when description is empty', () => {
    const project = { ...mockProject, description: '' };
    render(<ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Sin descripción')).toBeInTheDocument();
  });

  it('calls onEdit with project when Edit button is clicked', async () => {
    const onEdit = vi.fn();
    render(<ProjectCard project={mockProject} onEdit={onEdit} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /editar/i }));
    expect(onEdit).toHaveBeenCalledWith(mockProject);
  });

  it('shows inline delete confirmation when Delete button is clicked', async () => {
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(screen.getByText(/¿eliminar este proyecto\?/i)).toBeInTheDocument();
  });

  it('calls onDelete with project id when Confirm is clicked', async () => {
    const onDelete = vi.fn();
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('hides confirmation and does not delete when Cancel is clicked', async () => {
    const onDelete = vi.fn();
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByText(/¿eliminar este proyecto\?/i)).not.toBeInTheDocument();
  });
});
