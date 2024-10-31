import clsx from 'clsx';
import React, { ReactNode } from 'react';

type Heading1Props = {
  children: ReactNode;
  className?: string;
};
export const Heading1 = ({ children, className }: Heading1Props) => (
  <h1 className={clsx(`my-5 text-3xl leading-8 font-bold`, className)}>{children}</h1>
);
