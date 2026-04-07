'use client';

import { useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import { AttestationConformitéFormInput } from '../AttestationConformité.inputs';

import {
  modifierAttestationConformitéAction,
  ModifierAttestationConformitéFormKeys,
} from './modifierAttestationConformité.action';

export type ModifierAttestationConformitéFormProps = {
  identifiantProjet: string;
};

export const ModifierAttestationConformitéForm = ({
  identifiantProjet,
}: ModifierAttestationConformitéFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierAttestationConformitéFormKeys>
  >({});

  return (
    <Form
      action={modifierAttestationConformitéAction}
      onValidationError={setValidationErrors}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />
      <AttestationConformitéFormInput validationErrors={validationErrors} />
    </Form>
  );
};
