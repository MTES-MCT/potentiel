/* eslint-disable react/jsx-props-no-spreading */
'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';

import { SubmitButton } from './SubmitButton';

export type FormActionButtonsProps = {
  submitDisabled?: boolean;
  submitLabel: string;
  secondaryAction?:
    | {
        type: 'cancel';
        onClick: () => void;
      }
    | {
        type: 'back';
      };
};

export const FormActionButtons = ({
  secondaryAction,
  submitLabel,
  submitDisabled,
}: FormActionButtonsProps) => {
  const router = useRouter();

  return (
    <>
      {secondaryAction ? (
        secondaryAction.type === 'back' ? (
          <Button
            onClick={() => router.back()}
            priority="secondary"
            iconId="fr-icon-arrow-left-line"
          >
            Retour
          </Button>
        ) : (
          <Button type="button" priority="secondary" onClick={secondaryAction.onClick}>
            Retour
          </Button>
        )
      ) : null}
      <SubmitButton disabled={!!submitDisabled}>{submitLabel}</SubmitButton>
    </>
  );
};
