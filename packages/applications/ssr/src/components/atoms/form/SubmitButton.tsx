'use client';
import Button from '@codegouvfr/react-dsfr/Button';
import { FC } from 'react';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = {
  disabledCondition?: () => boolean;
  children: React.ReactNode;
};
export const SubmitButton: FC<SubmitButtonProps> = ({ disabledCondition, children }) => {
  const { pending } = useFormStatus();
  const isDisabled = disabledCondition ? disabledCondition() : false;

  return (
    <Button
      type="submit"
      priority="primary"
      disabled={pending || isDisabled}
      className="bg-blue-france-sun-base text-white"
      nativeButtonProps={{
        'aria-disabled': pending || isDisabled,
      }}
    >
      {children}
    </Button>
  );
};
