
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from './types';

export const useAuthFunctions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
        setIsAdmin(data.role === 'admin');
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      navigate('/');
      toast({
        title: "Login successful",
        description: "Welcome back to CustomerFlow",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, businessName: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            business_name: businessName,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBusinessName = async (userId: string, businessName: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ business_name: businessName })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setProfile(prev => ({
        ...prev,
        business_name: businessName
      }));

      toast({
        title: "Business name updated",
        description: "Your business name has been successfully updated",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      // Even if there's an error (like session not found), we should still
      // clear the local state and redirect the user to the auth page
      navigate('/auth');
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    profile,
    setProfile,
    isAdmin,
    setIsAdmin,
    fetchProfile,
    signIn,
    signUp,
    updateBusinessName,
    signOut
  };
};
