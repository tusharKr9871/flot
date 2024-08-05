"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/network/axiosInstance";
import * as Sentry from "@sentry/nextjs";

type UserType = {
  id: string;
  token: string;
  name: string;
} | null;

type AuthContextType = {
  user: UserType;
  setUser: Dispatch<SetStateAction<UserType>>;
  logout: () => Promise<void>;
  revalidateToken: (token: string) => Promise<void>;
  loading: boolean;
};

//@ts-ignore
const AuthContext = createContext<AuthContextType>();

// Custom hook to access the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{
    id: string;
    token: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const revalidateToken = useCallback(
    async (token: string) => {
      const url = "/auth/revalidate";
      try {
        const res = await axiosInstance.get(url, {
          headers: {
            "auth-token": token,
          },
        });
        setUser({
          id: res.data.id,
          token,
          name: res.data.name,
        });
        localStorage.setItem("token", token);
        setLoading(false);
      } catch (error) {
        toast.error("Error in validating token!");
        await localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        router.replace("/");
        Sentry.captureException(error);
      }
    },
    [router]
  );

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      revalidateToken(token);
    } else {
      setLoading(false);
    }
  }, [revalidateToken]);

  const logout = async () => {
    await localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out!");
    router.replace("/");
  };

  const authContextValue = {
    user,
    setUser,
    logout,
    revalidateToken,
    loading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
