import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../../src/features/Layout/Sidebar';

describe('Sidebar component', () => {
  it('should render sidebar container', () => {
    render(<Sidebar />);
    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toBeInTheDocument();
  });

  it('should display app title', () => {
    render(<Sidebar />);
    expect(screen.getByText('WorkFlow')).toBeInTheDocument();
  });

  it('should have navigation links', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('should apply correct CSS class', () => {
    render(<Sidebar />);
    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toHaveClass('sidebar');
  });

  it('should have correct semantic structure', () => {
    const { container } = render(<Sidebar />);
    const navElement = container.querySelector('nav.sidebar');
    expect(navElement).toBeInTheDocument();
    const list = navElement.querySelector('ul');
    expect(list).toBeInTheDocument();
  });

  it('should render list items for each navigation link', () => {
    const { container } = render(<Sidebar />);
    const listItems = container.querySelectorAll('.sidebar ul li');
    expect(listItems.length).toBeGreaterThanOrEqual(3); // At least 3 items
  });
});
