'use client';
import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  enregistrerAttestationGarantiesFinancièresAction,
  EnregistrerAttestationGarantiesFinancièresFormKeys,
} from './enregistrerAttestationGarantiesFinancières.action';

export type EnregistrerAttestationGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const EnregistrerAttestationGarantiesFinancièresForm: FC<
  EnregistrerAttestationGarantiesFinancièresFormProps
> = ({ identifiantProjet }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<EnregistrerAttestationGarantiesFinancièresFormKeys>
  >({});

  return (
    <Form
      action={enregistrerAttestationGarantiesFinancièresAction}
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
          <SubmitButton>Enregistrer</SubmitButton>
        </>
      }
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />

      <InputDate
        label="Date de constitution"
        nativeInputProps={{
          type: 'date',
          name: 'dateConstitution',
          max: now(),
          required: true,
          'aria-required': true,
        }}
        state={validationErrors['dateConstitution'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateConstitution']}
      />

      <UploadNewOrModifyExistingDocument
        label="Attestation de constitution"
        name="attestation"
        required
        formats={['pdf']}
        state={validationErrors['attestation'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['attestation']}
      />
    </Form>
  );
};
