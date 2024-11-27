'use client';
import { SessionProvider } from 'next-auth/react';

type LayoutProps = {
  children: JSX.Element;
};

export default function RootLayout({ children }: LayoutProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
