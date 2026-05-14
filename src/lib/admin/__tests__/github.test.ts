import { GitHubService } from '@/lib/admin/github';

describe('GitHubService', () => {
  let service: GitHubService;

  beforeEach(() => {
    service = new GitHubService();
  });

  it('should add a change to pending list', () => {
    service.addChange({
      type: 'add',
      path: 'test.json',
      content: '{}',
      encoding: 'utf-8',
    });

    const changes = service.getPendingChanges();
    expect(changes).toHaveLength(1);
    expect(changes[0].path).toBe('test.json');
  });

  it('should update existing change with same path', () => {
    service.addChange({
      type: 'add',
      path: 'test.json',
      content: '{"old": true}',
      encoding: 'utf-8',
    });

    service.addChange({
      type: 'update',
      path: 'test.json',
      content: '{"new": true}',
      encoding: 'utf-8',
    });

    const changes = service.getPendingChanges();
    expect(changes).toHaveLength(1);
    expect(changes[0].type).toBe('update');
    expect(changes[0].content).toBe('{"new": true}');
  });

  it('should clear pending changes', () => {
    service.addChange({
      type: 'add',
      path: 'test.json',
      content: '{}',
      encoding: 'utf-8',
    });

    service.clearPendingChanges();
    expect(service.getPendingChanges()).toHaveLength(0);
  });

  it('should return error when no pending changes', async () => {
    const result = await service.commitAndPush('test commit');
    expect(result.success).toBe(false);
    expect(result.error).toBe('No pending changes to commit');
  });
});
