/* eslint-disable react/jsx-props-no-spreading */
import Button from '@codegouvfr/react-dsfr/Button';

import { SubmitButton } from './SubmitButton';

export type FormActionButtonsProps = {
  submitLabel: string;
  back?:
    | {
        href?: undefined;
        label: string;
        onClick: () => void;
      }
    | {
        href: string;
        label: string;
        onClick?: undefined;
      };
};

export const FormActionButtons = ({ back, submitLabel }: FormActionButtonsProps) => {
  return (
    <>
      {back && (
        <Button
          priority="secondary"
          iconId="fr-icon-arrow-left-line"
          {...(back.href
            ? {
                href: back.href,
                prefetch: false,
              }
            : {
                onClick: back.onClick,
              })}
        >
          {back.label}
        </Button>
      )}
      <SubmitButton>{submitLabel}</SubmitButton>
    </>
  );
};
