
import React, { createContext, useState, useContext, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initial check
    setUser(pb.authStore.model);
    setIsLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      await api.auth.login(email, password);
      toast({
        title: "Erfolgreich angemeldet",
        description: "Willkommen zurück!",
        className: "bg-[#10b981] text-white border-none",
        duration: 4000,
      });
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Ungültige E-Mail oder Passwort.",
        variant: "destructive",
        duration: 4000,
      });
      return { success: false, error: 'Ungültige E-Mail oder Passwort.' };
    }
  };

  const signup = async (arg1, arg2, arg3) => {
    try {
      let signupData;
      
      // Support both new object format and legacy arguments
      if (typeof arg1 === 'object' && arg1 !== null) {
        signupData = {
          ...arg1,
          passwordConfirm: arg1.passwordConfirm || arg1.password,
          role: arg1.role || 'user'
        };
      } else {
        signupData = {
          name: arg1,
          email: arg2,
          password: arg3,
          passwordConfirm: arg3,
          role: 'user'
        };
      }

      await api.auth.signup(signupData);
      
      // Auto login after signup
      await api.auth.login(signupData.email, signupData.password);
      
      toast({
        title: "Registrierung erfolgreich",
        description: "Dein Konto wurde erstellt.",
        className: "bg-[#10b981] text-white border-none",
        duration: 4000,
      });
      
      return pb.authStore.model;
    } catch (err) {
      console.error('Signup error:', err);
      let errorMsg = 'Registrierung fehlgeschlagen.';
      if (err.response?.data?.email?.code === 'validation_not_unique') {
        errorMsg = 'Diese E-Mail-Adresse wird bereits verwendet.';
      } else if (err.response?.data?.password) {
        errorMsg = 'Passwort erfüllt nicht die Anforderungen.';
      }
      
      toast({
        title: "Fehler bei der Registrierung",
        description: errorMsg,
        variant: "destructive",
        duration: 4000,
      });
      
      throw new Error(errorMsg);
    }
  };

  const resetPassword = async (email) => {
    try {
      await api.auth.requestPasswordReset(email);
      toast({
        title: "E-Mail gesendet",
        description: "Wir haben dir einen Link zum Zurücksetzen geschickt.",
        className: "bg-[#c4a850] text-[#0a0f0d] border-none",
        duration: 4000,
      });
      return { success: true };
    } catch (err) {
      console.error('Reset password error:', err);
      toast({
        title: "Fehler",
        description: "Fehler beim Senden der E-Mail. Bitte überprüfe die Adresse.",
        variant: "destructive",
        duration: 4000,
      });
      return { success: false, error: 'Fehler beim Senden der E-Mail. Bitte überprüfe die Adresse.' };
    }
  };

  const logout = () => {
    try {
      api.auth.logout();
      setUser(null);
      toast({
        title: "Abgemeldet",
        description: "Du wurdest erfolgreich abgemeldet.",
        className: "bg-[#141210] text-[#e8e4df] border-[rgba(196,168,80,0.2)]",
        duration: 4000,
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isLoggedIn,
      isAdmin,
      login, 
      signup, 
      register: signup, 
      resetPassword, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
