import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../src/components/Common/Button';
import { Badge } from '../../src/components/Common/Badge';
import { Modal } from '../../src/components/Common/Modal';
import { SearchBar } from '../../src/components/Common/SearchBar';

describe('Common Components', () => {
  describe('Button', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should apply variant class', () => {
      const { container } = render(<Button variant="primary">Primary</Button>);
      const button = container.querySelector('button.btn-primary');
      expect(button).toBeInTheDocument();
    });

    it('should handle click events', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Badge', () => {
    it('should render badge with text', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should apply color variant', () => {
      const { container } = render(<Badge color="success">Done</Badge>);
      const badge = container.querySelector('span.badge-success');
      expect(badge).toBeInTheDocument();
    });

    it('should render with default variant', () => {
      const { container } = render(<Badge>Default</Badge>);
      const badge = container.querySelector('span.badge');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Modal', () => {
    it('should render modal when open is true', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <div>Modal content</div>
        </Modal>
      );
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render modal when open is false', () => {
      render(
        <Modal isOpen={false} onClose={() => {}}>
          <div>Hidden content</div>
        </Modal>
      );
      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('should call onClose when close button clicked', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <div>Content</div>
        </Modal>
      );
      const closeButton = screen.getByRole('button', { name: /close|×/i });
      await user.click(closeButton);
      expect(handleClose).toHaveBeenCalled();
    });

    it('should display title when provided', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="My Modal">
          <div>Content</div>
        </Modal>
      );
      expect(screen.getByText('My Modal')).toBeInTheDocument();
    });
  });

  describe('SearchBar', () => {
    it('should render search input', () => {
      render(<SearchBar onSearch={() => {}} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should accept input text', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={() => {}} />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'search query');
      expect(input).toHaveValue('search query');
    });

    it('should call onSearch with input value', async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBar onSearch={handleSearch} placeholder="Search..." />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      expect(input).toHaveValue('test');
    });

    it('should display placeholder text', () => {
      render(<SearchBar onSearch={() => {}} placeholder="Search tasks..." />);
      expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
    });
  });
});
