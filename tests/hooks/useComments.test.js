import { describe, it, expect, beforeEach } from 'vitest';
import { useComments } from '../../src/hooks/useComments';
import { createComment } from '../../src/data/entities/Comment';

describe('useComments hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty array', () => {
    const { comments } = useComments();
    expect(Array.isArray(comments)).toBe(true);
    expect(comments.length).toBe(0);
  });

  it('should add a new comment', () => {
    const { addComment, comments } = useComments();
    const newComment = addComment('task-1', 'Test comment text');

    expect(newComment.id).toBeDefined();
    expect(newComment.taskId).toBe('task-1');
    expect(newComment.text).toBe('Test comment text');
    expect(newComment.createdAt).toBeDefined();
    expect(comments.length).toBe(1);
  });

  it('should retrieve all comments', () => {
    const { addComment, comments } = useComments();
    addComment('task-1', 'Comment 1');
    addComment('task-1', 'Comment 2');

    expect(comments.length).toBe(2);
  });

  it('should retrieve comment by ID', () => {
    const { addComment, getCommentById } = useComments();
    const added = addComment('task-1', 'Test comment');
    const retrieved = getCommentById(added.id);

    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(added.id);
    expect(retrieved.text).toBe('Test comment');
  });

  it('should return undefined for non-existent comment ID', () => {
    const { getCommentById } = useComments();
    const result = getCommentById('non-existent-id');
    expect(result).toBeUndefined();
  });

  it('should get comments by task ID', () => {
    const { addComment, getCommentsByTaskId } = useComments();
    addComment('task-1', 'Comment 1');
    addComment('task-1', 'Comment 2');
    addComment('task-2', 'Comment 3');

    const task1Comments = getCommentsByTaskId('task-1');
    expect(task1Comments.length).toBe(2);
    expect(task1Comments.every(c => c.taskId === 'task-1')).toBe(true);
  });

  it('should return empty array for task with no comments', () => {
    const { getCommentsByTaskId } = useComments();
    const result = getCommentsByTaskId('non-existent-task');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should update a comment', () => {
    const { addComment, updateComment, getCommentById } = useComments();
    const added = addComment('task-1', 'Original text');

    const updated = updateComment(added.id, { text: 'Updated text' });
    expect(updated.text).toBe('Updated text');
    expect(updated.taskId).toBe('task-1');

    const retrieved = getCommentById(added.id);
    expect(retrieved.text).toBe('Updated text');
  });

  it('should return undefined when updating non-existent comment', () => {
    const { updateComment } = useComments();
    const result = updateComment('non-existent-id', { text: 'New text' });
    expect(result).toBeUndefined();
  });

  it('should delete a comment', () => {
    const { addComment, deleteComment, getCommentById } = useComments();
    const added = addComment('task-1', 'Comment to delete');

    const deleted = deleteComment(added.id);
    expect(deleted).toBe(true);
    expect(getCommentById(added.id)).toBeUndefined();
  });

  it('should return false when deleting non-existent comment', () => {
    const { deleteComment } = useComments();
    const result = deleteComment('non-existent-id');
    expect(result).toBe(false);
  });

  it('should persist comments to localStorage', () => {
    const { addComment } = useComments();
    addComment('task-1', 'Persistent comment');

    const { comments } = useComments();
    expect(comments.length).toBe(1);
    expect(comments[0].text).toBe('Persistent comment');
  });

  it('should provide comment count', () => {
    const { addComment, commentCount } = useComments();
    expect(commentCount()).toBe(0);
    addComment('task-1', 'Comment 1');
    expect(commentCount()).toBe(1);
    addComment('task-1', 'Comment 2');
    expect(commentCount()).toBe(2);
  });

  it('should return fresh comments array on each access', () => {
    const hook = useComments();
    const count1 = hook.comments.length;
    hook.addComment('task-1', 'New comment');
    const count2 = hook.comments.length;

    expect(count1).toBe(0);
    expect(count2).toBe(1);
  });
});
