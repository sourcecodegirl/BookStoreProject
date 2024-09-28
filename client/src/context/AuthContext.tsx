import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextProps {
  token: string | null;
  signin: (token: string) => void;
  signout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const signin = (newToken: string) => setToken(newToken);
  const signout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
