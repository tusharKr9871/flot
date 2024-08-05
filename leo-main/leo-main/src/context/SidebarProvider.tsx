'use client';

import { ReactNode, createContext, useState } from 'react';

export type SideBarContextType = {
  expanded: boolean;
  setExpanded: (val: (prevVal: boolean) => boolean) => void;
  subMenuExpanded: number;
  setSubMenuExpanded: (val: (prevVal: number) => number) => void;
  selectedMenu: string;
  setSelectedMenu: (val: string) => void;
};

//@ts-ignore
export const SidebarContext = createContext<SideBarContextType>();

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [subMenuExpanded, setSubMenuExpanded] = useState<number>(-1);
  const [selectedMenu, setSelectedMenu] = useState<string>('');

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        setExpanded,
        subMenuExpanded,
        setSubMenuExpanded,
        selectedMenu,
        setSelectedMenu,
      }}>
      {children}
    </SidebarContext.Provider>
  );
};
