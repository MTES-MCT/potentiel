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
          type="button"
          priority="secondary"
          {...(back.href
            ? {
                href: back.href,
                prefetch: false,
                iconId: 'fr-icon-arrow-left-line',
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
