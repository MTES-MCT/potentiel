'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import clsx from 'clsx';
import { FC } from 'react';
import { useFormStatus } from 'react-dom';

export type SubmitButtonProps = {
  disabled?: boolean;
  children: React.ReactNode;
  classname?: string;
};
export const SubmitButton: FC<SubmitButtonProps> = ({ disabled, children, classname }) => {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled || false;

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
      {pending && <Loader />}
      {children}
    </Button>
  );
};

const Loader = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
