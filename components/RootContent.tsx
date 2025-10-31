'use client';

import { Header } from './Header';

export function RootContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
