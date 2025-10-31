'use client';

import { Suspense } from 'react';
import { Header } from './Header';

function HeaderFallback() {
  return <div style={{ height: '200px', backgroundColor: 'var(--background)' }} />;
}

export function RootContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>
      {children}
    </>
  );
}
