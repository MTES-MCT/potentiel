import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { Icon, IconProps } from '../Icon';

type Heading2Props = {
  children: ReactNode;
  className?: string;
  icon?: IconProps;
};
export const Heading2 = ({ children, className, icon }: Heading2Props) => (
  <h2 className={clsx(`pb-1 text-[26px] leading-7 font-bold`, className)}>
    {icon && (
      <Icon
        id={icon.id}
        className={clsx('mr-2', icon.className)}
        size={icon.size}
        title={icon.title}
      />
    )}
    {children}
  </h2>
);
