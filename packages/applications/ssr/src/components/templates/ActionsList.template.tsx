'use client';

import { FC } from 'react';
import clsx from 'clsx';

import { Heading2 } from '../atoms/headings';

type PageTemplateProps = {
  children: React.ReactNode;
  actionsListLength: number;
  className?: string;
};

export const ActionsList: FC<PageTemplateProps> = ({ children, actionsListLength, className }) =>
  actionsListLength === 0 ? null : (
    <div className={clsx(`flex md:flex-col gap-4 flex-wrap`, className)}>
      <Heading2>Actions</Heading2>
      {children}
    </div>
  );
