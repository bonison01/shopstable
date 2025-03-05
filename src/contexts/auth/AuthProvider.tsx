
import React, { createContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserProfile } from './types';
import { useAuthFunctions } from './useAuthFunctions';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  const {
    isLoading,
    setIsLoading,
    profile,
    setProfile,
    isAdmin,
    setIsAdmin,
    fetchProfile,
    signIn,
    signUp,
    updateBusinessName: updateProfileBusinessName,
    signOut
  } = useAuthFunctions();

  // Handle business name update (wrapper to pass in user id)
  const updateBusinessName = async (businessName: string) => {
    if (user) {
      await updateProfileBusinessName(user.id, businessName);
    }
  };

  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    updateBusinessName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
