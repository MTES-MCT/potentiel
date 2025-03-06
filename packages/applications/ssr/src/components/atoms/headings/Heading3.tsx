import clsx from 'clsx';
import React, { ReactNode } from 'react';

type Heading3Props = {
  children: ReactNode;
  className?: string;
};
export const Heading3 = ({ children, className }: Heading3Props) => (
  <h3 className={clsx(`text-xl leading-6 font-bold`, className)}>{children}</h3>
);
