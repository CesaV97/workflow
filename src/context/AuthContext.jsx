import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    const client = getSupabaseClient();

    // Check for recovery mode in URL hash/search (initial load)
    const isRecoveryTab =
      window.location.hash.includes('type=recovery') ||
      window.location.search.includes('type=recovery');

    client.auth.getSession().then(({ data, error }) => {
      if (error) {
        setLoading(false);
        return;
      }

      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (isRecoveryTab && data.session?.user) {
        setIsRecovery(true);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'PASSWORD_RECOVERY') {
        const isRecoveryEvent =
          window.location.hash.includes('type=recovery') ||
          window.location.search.includes('type=recovery');
        if (isRecoveryEvent) {
          setIsRecovery(true);
          setSession(nextSession ?? null);
          setUser(nextSession?.user ?? null);
          setLoading(false);
        }
        return;
      }
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearRecovery = useCallback(() => setIsRecovery(false), []);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      isRecovery,
      isConfigured: isSupabaseConfigured,
      async signIn(email, password) {
        const client = getSupabaseClient();
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      async signUp(email, password) {
        const client = getSupabaseClient();
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.user?.identities?.length === 0) {
          throw new Error('Este correo ya tiene una cuenta registrada.');
        }
      },
      async signOut() {
        const client = getSupabaseClient();
        const { error } = await client.auth.signOut();
        if (error) throw error;
      },
      async sendPasswordReset(email) {
        const client = getSupabaseClient();
        const { error } = await client.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
      },
      async updatePassword(newPassword) {
        const client = getSupabaseClient();
        const { error } = await client.auth.updateUser({ password: newPassword });
        if (error) throw error;
        await client.auth.signOut();
        clearRecovery();
      },
    }),
    [loading, session, user, isRecovery, clearRecovery]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
