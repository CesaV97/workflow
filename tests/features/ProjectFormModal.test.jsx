import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectFormModal } from '../../src/features/Dashboard/ProjectFormModal';

const mockProject = {
  id: '1',
  name: 'Existing Project',
  description: 'Existing description',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  status: 'Active',
};

describe('ProjectFormModal', () => {
  it('renders nothing when isOpen is false', () => {
    render(<ProjectFormModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/nombre/i)).not.toBeInTheDocument();
  });

  it('renders form fields when isOpen is true', () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estado/i)).toBeInTheDocument();
  });

  it('shows "Nuevo proyecto" title in create mode', () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText('Nuevo proyecto')).toBeInTheDocument();
  });

  it('shows "Editar proyecto" title in edit mode', () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} project={mockProject} />);
    expect(screen.getByText('Editar proyecto')).toBeInTheDocument();
  });

  it('pre-fills fields with project data in edit mode', () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} project={mockProject} />);
    expect(screen.getByLabelText(/nombre/i)).toHaveValue('Existing Project');
    expect(screen.getByLabelText(/descripción/i)).toHaveValue('Existing description');
  });

  it('shows error when submitting with empty name', async () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }));
    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
  });

  it('does not call onSave when name is empty', async () => {
    const onSave = vi.fn();
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }));
    expect(onSave).not.toHaveBeenCalled();
  });

  it('calls onSave with form data when form is valid', async () => {
    const onSave = vi.fn();
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);
    await userEvent.type(screen.getByLabelText(/nombre/i), 'New Project');
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Project' }));
  });

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn();
    render(<ProjectFormModal isOpen={true} onClose={onClose} onSave={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows endDate error when endDate is before startDate', async () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Test');
    await userEvent.type(screen.getByLabelText(/fecha de inicio/i), '2026-06-01');
    await userEvent.type(screen.getByLabelText(/fecha de fin/i), '2026-01-01');
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }));
    expect(screen.getByText('La fecha de fin debe ser posterior al inicio')).toBeInTheDocument();
  });
});
