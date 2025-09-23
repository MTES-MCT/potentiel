'use client';
import { FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
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
      actionButtons={{
        submitButtonLabel: 'Enregistrer',
        backButton: {
          url: Routes.GarantiesFinancières.détail(identifiantProjet),
          label: 'Retour aux détails des garanties financières',
        },
      }}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />

      <InputDate
        label="Date de constitution"
        name="dateConstitution"
        max={now()}
        required
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
