import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  Dispatch,
} from 'react';
import toast from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { axiosInstance } from '@/network/axiosInstance';
import * as Sentry from '@sentry/react';
import { useTheme } from './ThemeContextProvider';
import { useGeolocated } from 'react-geolocated';
import axios from 'axios';

type subMenuType = {
  label: string;
  path: string;
};

type TabsToRender = {
  id: number;
  menu: string;
  subMenu?: subMenuType[];
};

type AuthContextType = {
  user: {
    id: string;
    token: string;
    tabsToRender: TabsToRender[];
    name: string;
    role: string;
  } | null;
  getOTP: ({ email }: { email: string }) => Promise<void>;
  validateOTP: ({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }) => Promise<void>;
  setFormStep: Dispatch<React.SetStateAction<number>>;
  selectProduct: (clientId: string) => Promise<void>;
  logout: () => Promise<void>;
  formStep: number;
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
    tabsToRender: TabsToRender[];
    name: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [formStep, setFormStep] = useState(1);
  const router = useRouter();
  const pathname = usePathname();
  const { getThemeValues } = useTheme();
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
  });

  const revalidateToken = useCallback(
    async (token: string) => {
      try {
        const url = '/auth/revalidate';
        setLoading(false);
        const res = await axiosInstance.get(url, {
          headers: {
            'auth-token': token,
          },
        });
        setUser({
          id: res.data.id,
          token,
          tabsToRender: res.data.tabsToRender,
          name: res.data.name,
          role: res.data.role,
        });
        if (pathname === '/login') {
          router.replace('/select-product');
        }
        setLoading(false);
      } catch (error) {
        toast.error('Error in validating token');
        await localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
        router.replace('/login');
      }
    },
    [pathname, router],
  );

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      revalidateToken(token);
    } else {
      setLoading(false);
      router.replace('/login');
    }
  }, [revalidateToken, router]);

  const getOTP = async ({ email }: { email: string }) => {
    setLoading(true);
    const url = '/auth/get_otp';
    try {
      await axiosInstance.post(url, { email });
      setTimeout(() => {
        setFormStep(2);
        toast.success('OTP sent successfully');
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Error in sending OTP');
      Sentry.captureException(error);
      setLoading(false);
    }
  };

  const validateOTP = async ({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }) => {
    setLoading(true);
    const url = '/auth/validate';
    try {
      const res = await axiosInstance.post(url, { email, otp });
      setUser({
        id: res.data.id,
        token: res.data.token,
        tabsToRender: res.data.tabsToRender,
        name: res.data.name,
        role: res.data.role,
      });
      // * store the token in local storage
      localStorage.setItem('token', res.data.token);
      toast.success('Logged In Successfully!');
      setFormStep(3);
      revalidateToken(res.data.token);
      setLoading(false);
    } catch (error: unknown) {
      toast.error('Error in validating OTP');
      Sentry.captureException(error);
      setLoading(false);
    }
  };

  const selectProduct = async (clientId: string) => {
    try {
      await localStorage.setItem('clientId', clientId);
      const res = await axios.get('https://api.ipify.org/?format=json');
      const ip = res.data.ip;
      await axiosInstance.post('/auth/login-event', {
        latitude: coords?.latitude,
        longitude: coords?.longitude,
        ipAddress: ip,
      });
      getThemeValues();
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    await localStorage.removeItem('token');
    await localStorage.removeItem('clientId');
    setUser(null);
    toast.success('Logged out!');
    setFormStep(1);
    router.replace('/login');
  };

  const authContextValue = {
    user,
    getOTP,
    validateOTP,
    formStep,
    setFormStep,
    selectProduct,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
