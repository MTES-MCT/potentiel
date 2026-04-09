'use client';

import { FC } from 'react';
import clsx from 'clsx';
import Button, { ButtonProps } from '@codegouvfr/react-dsfr/Button';
import { LinkProps } from 'next/link';

import { Heading2 } from '../atoms/headings';
import { ConfirmationAction, ConfirmationActionProps } from '../molecules/ConfirmationModal';

type LinkActionProps = {
  label: string;
  linkProps: LinkProps;
  buttonProps?: ButtonProps.Common &
    (Omit<ButtonProps.WithIcon, 'children'> | Omit<ButtonProps.WithoutIcon, 'children'>);
};

export type ActionProps = LinkActionProps | ConfirmationActionProps;

export type ActionsListPageTemplateProps = {
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
      actions: ActionProps[];
    }
);

export const ActionsList: FC<ActionsListPageTemplateProps> = ({
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
        ? actions.map((action) =>
            'linkProps' in action ? (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <LinkAction key={action.label} {...action} linkProps={action.linkProps} />
            ) : (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <ConfirmationAction key={action.label} {...action} />
            ),
          )
        : children}
    </div>
  );
};

const LinkAction = ({ label, linkProps, buttonProps }: LinkActionProps) => (
  <Button
    linkProps={linkProps}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...buttonProps}
    className={clsx('block w-1/2 text-center', buttonProps?.className)}
  >
    {label}
  </Button>
);
