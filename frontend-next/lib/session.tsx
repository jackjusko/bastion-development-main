'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearToken, getToken, type Profile } from './api';
import { dashboardPath } from './auth';

type SessionValue = {
  token: string;
  profile: Profile | null;
  loading: boolean;
  message: string;
  refresh: () => Promise<Profile | null>;
  goDashboard: () => void;
  logOut: () => void;
  flash: (text: string) => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setTokenState] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    const current = getToken();
    setTokenState(current);
    if (!current) {
      setProfile(null);
      setLoading(false);
      return null;
    }
    try {
      const data = await api<Profile>('/getProfileInfo');
      setProfile(data);
      setLoading(false);
      return data;
    } catch {
      setProfile(null);
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const flash = useCallback((text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3000);
  }, []);

  const value = useMemo<SessionValue>(() => ({
    token,
    profile,
    loading,
    message,
    refresh,
    goDashboard: () => router.push(dashboardPath(profile)),
    logOut: () => {
      clearToken();
      setTokenState('');
      setProfile(null);
      router.push('/');
    },
    flash
  }), [token, profile, loading, message, refresh, router, flash]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return ctx;
}
