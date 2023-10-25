import React, { ReactNode } from 'react';

export const PrintShow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div aria-hidden className={`hidden print:block ${className || ''}`}>
    {children}
  </div>
);
