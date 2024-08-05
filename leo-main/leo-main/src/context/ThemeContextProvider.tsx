import { axiosInstance } from '@/network/axiosInstance';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

export type ThemeContextType = {
  primaryColor: string | null;
  secondaryColor: string | null;
  logoUrl: string | null;
  getThemeValues: () => Promise<void>;
};

//@ts-ignore
const ThemeContext = createContext<ThemeContextType | null>();

// Custom hook to use the copy text context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [primaryColor, setPrimaryColor] = useState(null);
  const [secondaryColor, setSecondaryColor] = useState(null);
  const [logoUrl, setLogoUrl] = useState('https://www.assistfin.com/assets/img/1711689897logo-removebg-preview%20(3).png');

  const getThemeValues = async () => {
    const theme = await axiosInstance.get('/clients/get-client-theme');
    // setPrimaryColor(theme.data.primaryColor);
    // setSecondaryColor(theme.data.secondaryColor);
    // setLogoUrl(theme.data.logoUrl);
  };

  useEffect(() => {
    getThemeValues();
  }, []);
  
  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        secondaryColor,
        logoUrl,
        getThemeValues,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
