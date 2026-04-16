'use client';

import { FC } from 'react';
import clsx from 'clsx';

import { Heading2 } from '../atoms/headings';

export type ActionsListPageTemplateProps = {
  className?: string;
  children: React.ReactNode;
  actionsListLength: number;
  actions?: never;
};

export const ActionsList: FC<ActionsListPageTemplateProps> = ({
  children,
  actionsListLength,
  className,
}) => {
  if (actionsListLength === 0) {
    return null;
  }
  return (
    <div className={clsx(`flex md:flex-col gap-4 flex-wrap`, className)}>
      <Heading2 className="mb-1">Actions</Heading2>
      {children}
    </div>
  );
};
