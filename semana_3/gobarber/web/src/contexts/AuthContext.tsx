import React, { createContext, useCallback, useContext, useState } from "react";

import api from "../services/api";

interface SignInCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}
interface AuthContextState {
  user: User;
  signIn({ email, password }: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}
const AuthContext = createContext<AuthContextState>({} as AuthContextState);

interface AuthState {
  token: string;
  user: User;
}
const AuthContextProviver: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@GOBARBER:token");
    const user = localStorage.getItem("@GOBARBER:user");

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
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

      api.defaults.headers.authorization = `Bearer ${token}`;
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

  const updateUser = useCallback(
    (user: User) => {
      setData({
        token: data.token,
        user,
      });
      localStorage.setItem("@GOBARBER:user", JSON.stringify(user));
    },
    [setData, data.token]
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
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
