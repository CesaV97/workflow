import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommentThread } from '../../src/features/Comments/CommentThread';

vi.mock('../../src/hooks/useComments', () => ({
  useComments: () => ({
    comments: [
      { id: '1', taskId: '1', text: 'Comment 1', createdAt: new Date().toISOString() },
    ],
    addComment: vi.fn(),
    getCommentsByTaskId: (taskId) => [
      { id: '1', taskId: '1', text: 'Comment 1', createdAt: new Date().toISOString() },
    ],
  }),
}));

describe('CommentThread feature', () => {
  it('should render comments', () => {
    render(<CommentThread taskId="1" />);
    expect(screen.getByText('Comment 1')).toBeInTheDocument();
  });

  it('should display comment input', () => {
    render(<CommentThread taskId="1" />);
    expect(screen.getByPlaceholderText(/add a comment/i)).toBeInTheDocument();
  });
});
