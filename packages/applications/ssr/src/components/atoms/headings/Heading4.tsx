import clsx from 'clsx';
import type { ReactNode } from 'react';

type Heading4Props = {
  children: ReactNode;
  className?: string;
};
export const Heading4 = ({ children, className }: Heading4Props) => (
  <h4 className={clsx(`text-xl font-bold`, className)}>{children}</h4>
);
