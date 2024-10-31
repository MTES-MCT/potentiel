import clsx from 'clsx';
import React, { ReactNode } from 'react';

type Heading2Props = {
  children: ReactNode;
  className?: string;
};
export const Heading2 = ({ children, className }: Heading2Props) => (
  <h2 className={clsx(`pb-1 text-[26px] leading-7 font-bold`, className)}>{children}</h2>
);
