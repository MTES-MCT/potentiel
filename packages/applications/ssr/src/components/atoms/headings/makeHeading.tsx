import clsx from 'clsx';
import type { ReactNode } from 'react';

type ComponentProp = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingProps = {
  as?: ComponentProp;
  children: ReactNode;
  className?: string;
};

type MakeHeadingProps = {
  defaultAs: ComponentProp;
  defaultClassName: string;
  defaultChildren?: ReactNode;
};

export const makeHeading =
  ({ defaultAs, defaultClassName }: MakeHeadingProps) =>
  ({ children, as, className }: HeadingProps) => {
    const Component = as ?? defaultAs;
    return <Component className={clsx(defaultClassName, className)}>{children}</Component>;
  };
