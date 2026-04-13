'use client';

import { useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import { AttestationConformitéFormInput } from '../AttestationConformité.inputs';

import {
  enregistrerAttestationConformitéAction,
  EnregistrerAttestationConformitéFormKeys,
} from './enregistrerAttestationConformité.action';

export type EnregistrerAttestationConformitéFormProps = {
  identifiantProjet: string;
};

export const EnregistrerAttestationConformitéForm = ({
  identifiantProjet,
}: EnregistrerAttestationConformitéFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<EnregistrerAttestationConformitéFormKeys>
  >({});

  return (
    <Form
      action={enregistrerAttestationConformitéAction}
      onValidationError={setValidationErrors}
      actionButtons={{
        submitLabel: 'Enregistrer',
        secondaryAction: { type: 'back' },
      }}
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />
      <AttestationConformitéFormInput validationErrors={validationErrors} />
    </Form>
  );
};
