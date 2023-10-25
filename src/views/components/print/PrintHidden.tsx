import React, { ReactNode } from 'react';

export const PrintHidden = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`print:hidden ${className || ''}`}>{children}</div>;
