'use client';
import Button from '@codegouvfr/react-dsfr/Button';
import clsx from 'clsx';
import { FC } from 'react';
import { useFormStatus } from 'react-dom';

export type SubmitButtonProps = {
  disabledCondition?: () => boolean;
  children: React.ReactNode;
  classname?: string;
};
export const SubmitButton: FC<SubmitButtonProps> = ({ disabledCondition, children, classname }) => {
  const { pending } = useFormStatus();
  const isDisabled = pending || (disabledCondition ? disabledCondition() : false);

  return (
    <Button
      type="submit"
      priority="primary"
      disabled={isDisabled}
      className={clsx(`text-theme-white bg-theme-blueFrance`, classname)}
      nativeButtonProps={{
        'aria-disabled': isDisabled,
      }}
    >
      {children}
    </Button>
  );
};
