import clsx from 'clsx';
import React, { ReactNode } from 'react';

type Heading6Props = {
  children: ReactNode;
  className?: string;
};
export const Heading6 = ({ children, className }: Heading6Props) => (
  <h6 className={clsx(`text-base font-bold`, className)}>{children}</h6>
);
