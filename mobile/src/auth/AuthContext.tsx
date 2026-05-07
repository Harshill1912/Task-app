import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { StoredUser, tokenStorage, userStorage } from "./tokenStorage";

interface AuthContextValue {
  isLoading: boolean;
  token: string | null;
  user: StoredUser | null;
  signIn: (token: string, user: StoredUser) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([tokenStorage.get(), userStorage.get()])
      .then(([storedToken, storedUser]) => {
        setToken(storedToken);
        setUser(storedUser);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      token,
      user,
      signIn: async (newToken: string, newUser: StoredUser) => {
        await tokenStorage.set(newToken);
        await userStorage.set(newUser);
        setToken(newToken);
        setUser(newUser);
      },
      signOut: async () => {
        await tokenStorage.remove();
        await userStorage.remove();
        setToken(null);
        setUser(null);
      }
    }),
    [isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
