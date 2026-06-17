'use client';

import { useState } from 'react';

import type { DocumentProjet } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import {
  AttestationConformitéFormInput,
  RapportAssociéFormInput,
} from '../../AttestationConformité.inputs';
import {
  type EnregistrerAttestationConformitéFormKeys,
  enregistrerAttestationConformitéAction,
} from './enregistrerAttestationConformité.action';

export type EnregistrerAttestationConformitéFormProps = {
  identifiantProjet: string;
  attestationConformité?: DocumentProjet.RawType;
};

export const EnregistrerAttestationConformitéForm = ({
  identifiantProjet,
  attestationConformité,
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
      <AttestationConformitéFormInput
        validationErrors={validationErrors}
        attestationConformité={attestationConformité}
      />
      <RapportAssociéFormInput validationErrors={validationErrors} />
    </Form>
  );
};
