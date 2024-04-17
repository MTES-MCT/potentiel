import React, { FC } from 'react';

export const App: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    id="app"
    className="min-h-screen m-0 p-0 font-sans text-base text-grey-200-base leading-normal antialiased flex flex-col box-border relative w-full"
  >
    {children}
  </div>
);
