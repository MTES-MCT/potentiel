'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  soumettreGarantiesFinancièresAction,
  SoumettreGarantiesFinancièresFormKeys,
} from './dépôt/soumettre/soumettreGarantiesFinancières.action';
import {
  modifierDépôtEnCoursGarantiesFinancièresAction,
  ModifierDépôtEnCoursGarantiesFinancièresFormKeys,
} from './dépôt/modifier/modifierDépôtEnCoursGarantiesFinancières.action';
import {
  TypeGarantiesFinancièresSelect,
  TypeGarantiesFinancièresSelectProps,
} from './TypeGarantiesFinancièresSelect';
import {
  enregistrerGarantiesFinancièresAction,
  EnregistrerGarantiesFinancièresFormKeys,
} from './actuelles/enregistrer/enregistrerGarantiesFinancières.action';

type Action =
  | typeof soumettreGarantiesFinancièresAction
  | typeof modifierDépôtEnCoursGarantiesFinancièresAction
  | typeof enregistrerGarantiesFinancièresAction;

export type GarantiesFinancièresFormProps = {
  identifiantProjet: string;
  action: Action;
  submitButtonLabel: string;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
  defaultValues?: {
    typeGarantiesFinancières?: TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel'];
    dateÉchéance?: Iso8601DateTime;
    dateConstitution?: Iso8601DateTime;
    attestation?: string;
  };
};

export const GarantiesFinancièresForm: FC<GarantiesFinancièresFormProps> = ({
  identifiantProjet,
  action,
  submitButtonLabel,
  typesGarantiesFinancières,
  defaultValues,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<
      | ModifierDépôtEnCoursGarantiesFinancièresFormKeys
      | SoumettreGarantiesFinancièresFormKeys
      | EnregistrerGarantiesFinancièresFormKeys
    >
  >({});

  return (
    <Form
      action={action}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.GarantiesFinancières.détail(identifiantProjet),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour au détail des garanties financières
          </Button>
          <SubmitButton>{submitButtonLabel}</SubmitButton>
        </>
      }
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

      <TypeGarantiesFinancièresSelect
        id="type"
        name="type"
        typesGarantiesFinancières={typesGarantiesFinancières}
        dateÉchéanceActuelle={defaultValues?.dateÉchéance}
        typeGarantiesFinancièresActuel={defaultValues?.typeGarantiesFinancières}
        validationErrors={validationErrors}
      />

      <InputDate
        label="Date de constitution"
        nativeInputProps={{
          type: 'date',
          name: 'dateConstitution',
          max: now(),
          defaultValue: defaultValues?.dateConstitution,
          required: true,
          'aria-required': true,
        }}
        state={validationErrors['dateConstitution'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateConstitution']}
      />

      <UploadDocument
        label="Attestation de constitution"
        name="attestation"
        required
        state={validationErrors['attestation'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['attestation']}
        documentKey={defaultValues?.attestation}
      />
    </Form>
  );
};
