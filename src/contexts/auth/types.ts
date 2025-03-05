
import { Session, User } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  role?: string;
  [key: string]: any;
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, businessName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  updateBusinessName: (businessName: string) => Promise<void>;
};
