'use client';

import Sidebar from '@/components/sidebar';
import { SideBarContextType, SidebarContext } from '@/context/SidebarProvider';
import { useContext } from 'react';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setExpanded } = useContext<SideBarContextType>(SidebarContext);
  return (
    <section>
      <Sidebar>
        <div onClick={() => setExpanded(() => false)}>{children}</div>
      </Sidebar>
    </section>
  );
}
