import Button from '@codegouvfr/react-dsfr/Button';

import { SubmitButton } from './SubmitButton';

export type FormActionButtonsProps = {
  submitButtonLabel: string;
  backButton?:
    | {
        url?: undefined;
        label: string;
        onClick: () => Promise<void>;
      }
    | {
        url: string;
        label: string;
        onClick?: undefined;
      };
};

export const FormActionButtons = ({ backButton, submitButtonLabel }: FormActionButtonsProps) => {
  return (
    <>
      {backButton && (
        <Button
          priority="secondary"
          iconId="fr-icon-arrow-left-line"
          {...(backButton.url
            ? {
                href: backButton.url,
                prefetch: false,
              }
            : {
                onClick: backButton.onClick,
              })}
        >
          {backButton.label}
        </Button>
      )}
      <SubmitButton>{submitButtonLabel}</SubmitButton>
    </>
  );
};
