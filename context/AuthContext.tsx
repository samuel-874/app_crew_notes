import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext<{
  session: Session | null;
  user: User | null;
  signOut: () => void;
  initialized: boolean;
}>({
  session: null,
  user: null,
  signOut: () => {},
  initialized: false,
});

export const AuthProvider = ({ children }: any) => {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("event triggered: ", event);
      setSession(session);
      setUser(session?.user ?? null);
      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    signOut: () => supabase.auth.signOut(),
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
