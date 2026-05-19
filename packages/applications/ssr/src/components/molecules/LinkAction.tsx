import Button, { type ButtonProps } from '@codegouvfr/react-dsfr/Button';
import clsx from 'clsx';
import type { LinkProps } from 'next/link';

export type LinkActionProps = {
  label: string;
  linkProps: LinkProps;
  buttonProps?: ButtonProps.Common &
    (Omit<ButtonProps.WithIcon, 'children'> | Omit<ButtonProps.WithoutIcon, 'children'>);
};

export const LinkAction = ({ label, linkProps, buttonProps }: LinkActionProps) => (
  <Button
    linkProps={linkProps}
    {...buttonProps}
    className={clsx('block w-1/2 text-center', buttonProps?.className)}
  >
    {label}
  </Button>
);
