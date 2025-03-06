
import React, { createContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserProfile, CompanyAccessType } from './types';
import { useAuthFunctions } from './useAuthFunctions';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [staffCompanyAccess, setStaffCompanyAccess] = useState<CompanyAccessType[] | null>(null);
  
  const {
    isLoading,
    setIsLoading,
    profile,
    setProfile,
    isAdmin,
    setIsAdmin,
    isStaff,
    setIsStaff,
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

  // Fetch company access for staff members
  const fetchCompanyAccess = async (email: string) => {
    try {
      // First get staff ID by email
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id')
        .eq('staff_email', email)
        .single();

      if (staffError || !staffData) {
        console.log('Not found as staff or error:', staffError);
        setStaffCompanyAccess(null);
        return;
      }

      // Now get company access with staff ID
      const { data: accessData, error: accessError } = await supabase
        .from('company_access')
        .select('id, business_name, owner_id, staff_id, created_at')
        .eq('staff_id', staffData.id);

      if (accessError) {
        console.error('Error fetching company access:', accessError);
        setStaffCompanyAccess(null);
        return;
      }

      setStaffCompanyAccess(accessData as CompanyAccessType[]);
    } catch (error) {
      console.error('Error in fetchCompanyAccess:', error);
      setStaffCompanyAccess(null);
    }
  };

  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchCompanyAccess(session.user.email);
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
          fetchCompanyAccess(session.user.email);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsStaff(false);
          setStaffCompanyAccess(null);
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
    isStaff,
    updateBusinessName,
    staffCompanyAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
