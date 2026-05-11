import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  getRedirectResult,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user from server-side OAuth session
  const fetchServerUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const { user: serverUser } = await res.json();
        setUser(serverUser as any); // cast to Firebase User shape
      }
      // If not authenticated via server, do nothing (keep Firebase user if any)
    } catch (err) {
      console.error('Failed to fetch server user:', err);
    }
  }, []);

  // Initial check for server session on mount
  useEffect(() => {
    fetchServerUser();
  }, [fetchServerUser]);

  // Listen for OAuth success messages from popup
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'oauth-success') {
        fetchServerUser();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [fetchServerUser]);

  // Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    // Handle any pending redirect result (legacy)
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Redirect Error:", error);
      }
    };
    checkRedirect();

    return () => unsubscribe();
  }, []);

  const signup = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = () => {
    // Open OAuth flow in a centered popup
    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      '/api/oauth/authorize',
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Fallback if popup blocked: full-page redirect
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = '/api/oauth/authorize';
    }
  };

  const logout = async () => {
    await signOut(auth);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
  };

  const value = {
    user,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
