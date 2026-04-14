import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopBar } from '../../src/features/Layout/TopBar';

describe('TopBar component', () => {
  it('should render topbar container', () => {
    render(<TopBar title="Dashboard" />);
    const topbar = screen.getByRole('banner');
    expect(topbar).toBeInTheDocument();
  });

  it('should display provided title', () => {
    render(<TopBar title="My Projects" />);
    expect(screen.getByText('My Projects')).toBeInTheDocument();
  });

  it('should render with correct CSS class', () => {
    render(<TopBar title="Dashboard" />);
    const topbar = screen.getByRole('banner');
    expect(topbar).toHaveClass('topbar');
  });

  it('should render action area', () => {
    render(<TopBar title="Dashboard" />);
    const actionArea = screen.getByRole('region', { hidden: true });
    expect(actionArea).toBeInTheDocument();
  });

  it('should accept and render action buttons', () => {
    const actions = <button>Settings</button>;
    const { container } = render(<TopBar title="Dashboard" actions={actions} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should have correct semantic structure', () => {
    const { container } = render(<TopBar title="Dashboard" />);
    const header = container.querySelector('header.topbar');
    expect(header).toBeInTheDocument();
    const titleElement = header.querySelector('.topbar-title');
    expect(titleElement).toBeInTheDocument();
  });
});
