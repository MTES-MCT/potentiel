import React, { FC } from 'react';

export const App: FC = ({ children }) => (
  <div
    id="app"
    className="min-h-screen flex flex-col font-body text-base leading-normal antialiased box-border relative"
  >
    {children}
  </div>
);
