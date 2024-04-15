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
  const isDisabled = pending || (disabledCondition ? disabledCondition() : false);

  return (
    <Button
      type="submit"
      priority="primary"
      disabled={isDisabled}
      className="text-potentiel-white bg-potentiel-blueFrance"
      nativeButtonProps={{
        'aria-disabled': isDisabled,
      }}
    >
      {children}
    </Button>
  );
};
