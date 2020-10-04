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

interface IUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthContextState {
  user: IUser;
  loading: boolean;
  signIn({ email, password }: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: IUser): void;
}
const AuthContext = createContext<AuthContextState>({} as AuthContextState);

interface AuthState {
  token: string;
  user: IUser;
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

      api.defaults.headers.authorization = `Bearer ${token}`;

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

  const updateUser = useCallback(
    async (user: IUser) => {
      setData({
        token: data.token,
        user,
      });
      await AsyncStorage.multiSet([
        ["@GOBARBER:token", data.token],
        ["@GOBARBER:user", JSON.stringify(user)],
      ]);
    },
    [setData, data.token]
  );

  useEffect(() => {
    async function loadStorage(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        "@GOBARBER:token",
        "@GOBARBER:user",
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;
        setData({ user: JSON.parse(user[1]), token: token[1] });
      }

      setLoading(false);
    }

    loadStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser, loading }}
    >
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
