
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from './types';

export const useAuthFunctions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      // First check if user is in profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('Error fetching profile, checking if staff member:', error.message);
        
        // Get user email from auth
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          console.error('Error fetching user data:', userError?.message);
          setIsLoading(false);
          return;
        }
        
        const userEmail = userData.user.email;
        
        // Check if user is a staff member
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('staff_email', userEmail)
          .maybeSingle();

        if (staffError || !staffData) {
          console.error('Error fetching staff profile:', staffError?.message);
          setIsLoading(false);
          return;
        }

        // If staff is found, set staff flag
        setIsStaff(true);
        setProfile({
          id: userId,
          first_name: staffData.first_name,
          last_name: staffData.last_name,
          email: staffData.staff_email,
          role: 'staff'
        });
        setIsLoading(false);
        return;
      }

      if (data) {
        setProfile(data);
        setIsAdmin(data.role === 'admin');
        setIsStaff(data.role === 'staff');
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
    isStaff,
    setIsStaff,
    fetchProfile,
    signIn,
    signUp,
    updateBusinessName,
    signOut
  };
};
