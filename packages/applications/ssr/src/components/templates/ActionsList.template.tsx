'use client';

import { FC } from 'react';
import clsx from 'clsx';
import Button from '@codegouvfr/react-dsfr/Button';

import { Heading2 } from '../atoms/headings';

type PageTemplateProps = {
  className?: string;
} & (
  | {
      children: React.ReactNode;
      actionsListLength: number;
      actions?: never;
    }
  | {
      children?: never;
      actionsListLength?: never;
      actions: {
        label: string;
        href: string;
        title?: string;
      }[];
    }
);

export const ActionsList: FC<PageTemplateProps> = ({
  children,
  actionsListLength,
  className,
  actions,
}) => {
  if (actions) {
    actionsListLength = actions.length;
  }
  if (actionsListLength === 0) {
    return null;
  }
  return (
    <div className={clsx(`flex md:flex-col gap-4 flex-wrap`, className)}>
      <Heading2>Actions</Heading2>
      {actions
        ? actions.map(({ href, label, title }) => (
            <Button key={href} title={title} linkProps={{ href }} className="font-semibold">
              {label}
            </Button>
          ))
        : children}
    </div>
  );
};
