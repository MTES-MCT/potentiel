import Button from '@codegouvfr/react-dsfr/Button';

import { SubmitButton } from './SubmitButton';

type Props = {
  backButton?: {
    url: string;
    label: string;
  };
  submitButtonLabel: string;
};

export const FormActionButtons = ({ backButton, submitButtonLabel }: Props) => {
  return (
    <>
      {backButton && (
        <Button
          priority="secondary"
          linkProps={{
            href: backButton.url,
            prefetch: false,
          }}
          iconId="fr-icon-arrow-left-line"
        >
          {backButton.label}
        </Button>
      )}
      <SubmitButton>{submitButtonLabel}</SubmitButton>
    </>
  );
};
