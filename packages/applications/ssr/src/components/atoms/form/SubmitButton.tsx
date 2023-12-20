'use client';
import Button from '@codegouvfr/react-dsfr/Button';
import { FC } from 'react';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = {
  children: React.ReactNode;
};
export const SubmitButton: FC<SubmitButtonProps> = ({ children }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      priority="primary"
      disabled={pending}
      className="bg-blue-france-sun-base text-white"
    >
      {children}
    </Button>
  );
};
