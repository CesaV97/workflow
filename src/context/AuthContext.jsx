import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    const client = getSupabaseClient();

    client.auth.getSession().then(({ data, error }) => {
      if (error) {
        setLoading(false);
        return;
      }

      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      isConfigured: isSupabaseConfigured,
      async signIn(email, password) {
        const client = getSupabaseClient();
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) {
          throw error;
        }
      },
      async signUp(email, password) {
        const client = getSupabaseClient();
        const { error } = await client.auth.signUp({ email, password });
        if (error) {
          throw error;
        }
      },
      async signOut() {
        const client = getSupabaseClient();
        const { error } = await client.auth.signOut();
        if (error) {
          throw error;
        }
      },
    }),
    [loading, session, user]
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
