/* eslint-disable react/jsx-props-no-spreading */
import Button from '@codegouvfr/react-dsfr/Button';

import { SubmitButton } from './SubmitButton';

export type FormActionButtonsProps = {
  submitLabel: string;
  secondaryAction?:
    | {
        type: 'cancel';
        onClick: () => void;
      }
    | {
        type: 'back';
        href: string;
      };
};

export const FormActionButtons = ({ secondaryAction, submitLabel }: FormActionButtonsProps) => {
  return (
    <>
      {secondaryAction ? (
        secondaryAction.type === 'back' ? (
          <Button
            linkProps={{ href: secondaryAction.href, prefetch: false }}
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
      <SubmitButton>{submitLabel}</SubmitButton>
    </>
  );
};
