import { describe, it, expect } from 'vitest';
import { createComment, commentSchema } from '../../src/data/entities/Comment';

describe('Comment entity', () => {
  it('should have correct schema shape', () => {
    expect(commentSchema).toHaveProperty('id');
    expect(commentSchema).toHaveProperty('taskId');
    expect(commentSchema).toHaveProperty('text');
    expect(commentSchema).toHaveProperty('createdAt');
  });

  it('should create comment with generated ID', () => {
    const comment = createComment('task-uuid-123', 'Test comment');
    expect(comment.id).toBeDefined();
    expect(comment.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should set createdAt timestamp automatically', () => {
    const beforeCreate = new Date();
    const comment = createComment('task-uuid-123', 'Test comment');
    const afterCreate = new Date();

    expect(new Date(comment.createdAt).getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
    expect(new Date(comment.createdAt).getTime()).toBeLessThanOrEqual(afterCreate.getTime());
  });

  it('should preserve taskId and text', () => {
    const comment = createComment('task-uuid-123', 'Test comment');
    expect(comment.taskId).toBe('task-uuid-123');
    expect(comment.text).toBe('Test comment');
  });

  it('should create unique comment IDs', () => {
    const comment1 = createComment('task-123', 'Comment 1');
    const comment2 = createComment('task-123', 'Comment 2');
    expect(comment1.id).not.toBe(comment2.id);
  });
});
