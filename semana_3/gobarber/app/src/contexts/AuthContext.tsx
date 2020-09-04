import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

import AsyncStorage from "@react-native-community/async-storage";

import api from "../services/api";

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextState {
  user: object;
  loading: true;
  signIn({ email, password }: SignInCredentials): Promise<void>;
  signOut(): void;
}
const AuthContext = createContext<AuthContextState>({} as AuthContextState);

interface AuthState {
  token: string;
  user: object;
}
const AuthContextProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

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

      await AsyncStorage.multiSet([
        ["@GOBARBER:token", token],
        ["@GOBARBER:user", JSON.stringify(user)],
      ]);
    },
    []
  );

  const signOut = useCallback(async () => {
    setData({} as AuthState);
    await AsyncStorage.multiRemove(["@GOBARBER:token", "@GOBARBER:user"]);
  }, []);

  useEffect(() => {
    async function loadStorage(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        "@GOBARBER:token",
        "@GOBARBER:user",
      ]);

      if (token[1] && user[1]) {
        setData({ user: JSON.parse(user[1]), token: token[1] });
      }

      setLoading(false);
    }

    loadStorage();
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = (): AuthContextState => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Use Auth must be used within AuthContextProvider");
  }

  return context;
};

export default useAuthContext;
export { AuthContextProvider };
