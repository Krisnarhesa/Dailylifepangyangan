import { verifyAdminAuth } from '@/lib/admin/auth';

describe('Admin Auth', () => {
  it('should reject invalid token', async () => {
    const result = await verifyAdminAuth('invalid-token');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject empty token', async () => {
    const result = await verifyAdminAuth('');
    expect(result.valid).toBe(false);
  });
});
