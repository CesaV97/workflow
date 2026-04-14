import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MainContent } from '../../src/features/Layout/MainContent';

describe('MainContent component', () => {
  it('should render main content container', () => {
    render(<MainContent><div>Test content</div></MainContent>);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <MainContent>
        <div>Test child element</div>
      </MainContent>
    );
    expect(screen.getByText('Test child element')).toBeInTheDocument();
  });

  it('should apply correct CSS class', () => {
    render(<MainContent><div>Content</div></MainContent>);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('main-content');
  });

  it('should render multiple children', () => {
    render(
      <MainContent>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </MainContent>
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('should have correct semantic structure', () => {
    const { container } = render(
      <MainContent><div>Content</div></MainContent>
    );
    const mainElement = container.querySelector('main.main-content');
    expect(mainElement).toBeInTheDocument();
  });

  it('should work as container for TopBar and content', () => {
    const { container } = render(
      <MainContent>
        <header>Top section</header>
        <div>Main content</div>
      </MainContent>
    );
    const main = container.querySelector('main.main-content');
    expect(main).toBeInTheDocument();
    expect(screen.getByText('Top section')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });
});
