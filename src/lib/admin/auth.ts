import { supabaseAdmin } from './supabaseAdmin';

export async function verifyAdminAuth(token: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return { valid: false, error: 'Invalid token' };
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return { valid: false, error: 'User is not an admin' };
    }

    return { valid: true, userId: user.id };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

export function verifyApiSecret(secret: string): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    console.error('ADMIN_SECRET not configured');
    return false;
  }
  return secret === adminSecret;
}
