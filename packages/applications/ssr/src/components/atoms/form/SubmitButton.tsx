'use client';
import { fr } from '@codegouvfr/react-dsfr';
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
      className="text-white"
      style={{
        backgroundColor: fr.colors.decisions.background.active.blueFrance.default,
      }}
      nativeButtonProps={{
        'aria-disabled': isDisabled,
      }}
    >
      {children}
    </Button>
  );
};
