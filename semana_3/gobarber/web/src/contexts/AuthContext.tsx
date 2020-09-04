import React, { createContext, useCallback, useContext, useState } from "react";

import api from "../services/api";

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextState {
  user: object;
  signIn({ email, password }: SignInCredentials): Promise<void>;
  signOut(): void;
}
const AuthContext = createContext<AuthContextState>({} as AuthContextState);

interface AuthState {
  token: string;
  user: object;
}
const AuthContextProviver: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@GOBARBER:token");
    const user = localStorage.getItem("@GOBARBER:user");

    if (token && user) {
      return {
        token: token,
        user: JSON.parse(user),
      };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(
    async ({ email, password }: SignInCredentials): Promise<void> => {
      const { data } = await api.post("/sessions", {
        email,
        password,
      });

      const { token, user } = data;

      setData({
        user,
        token,
      });

      localStorage.setItem("@GOBARBER:token", token);
      localStorage.setItem("@GOBARBER:user", JSON.stringify(user));
    },
    []
  );

  const signOut = useCallback(() => {
    setData({} as AuthState);
    localStorage.removeItem("@GOBARBER:token");
    localStorage.removeItem("@GOBARBER:user");
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = (): AuthContextState => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Use Auth must be used within AuthContextProviver");
  }

  return context;
};

export default useAuthContext;
export { AuthContextProviver };
