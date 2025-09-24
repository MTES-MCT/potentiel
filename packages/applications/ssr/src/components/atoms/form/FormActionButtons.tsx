/* eslint-disable react/jsx-props-no-spreading */
import Button from '@codegouvfr/react-dsfr/Button';

import { SubmitButton } from './SubmitButton';

export type FormActionButtonsProps = {
  submitLabel: string;
  secondaryAction?:
    | {
        type: 'cancel';
        label: string;
        onClick: () => void;
      }
    | {
        type: 'back';
        href: string;
        label: string;
      };
};

export const FormActionButtons = ({ secondaryAction, submitLabel }: FormActionButtonsProps) => {
  return (
    <>
      {secondaryAction && (
        <Button
          type="button"
          priority="secondary"
          {...(secondaryAction.type === 'back'
            ? {
                href: secondaryAction.href,
                prefetch: false,
                iconId: 'fr-icon-arrow-left-line',
              }
            : {
                onClick: secondaryAction.onClick,
              })}
        >
          {secondaryAction.label}
        </Button>
      )}
      <SubmitButton>{submitLabel}</SubmitButton>
    </>
  );
};
