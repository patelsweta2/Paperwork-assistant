import {type ReactNode,useState} from 'react';
import { ThemeContext } from './ThemeContext';

type ThemeProviderProps = {
  children: ReactNode;
}

export default function ThemeProvider ({children}:ThemeProviderProps)  {
    const [theme,setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{theme,setTheme}}>
        {children}
    </ThemeContext.Provider>
  )
}
