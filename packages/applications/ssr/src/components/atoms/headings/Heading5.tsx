import clsx from 'clsx';
import React, { ReactNode } from 'react';

type Heading5Props = {
  children: ReactNode;
  className?: string;
};
export const Heading5 = ({ children, className }: Heading5Props) => (
  <h5 className={clsx(`text-lg font-bold`, className)}>{children}</h5>
);
