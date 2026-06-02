'use client';

import { useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import {
  AttestationConformitéFormInput,
  type AttestationConformitéFormInputProps,
  RapportAssociéFormInput,
  type RapportAssociéFormInputProps,
} from '../../AttestationConformité.inputs';
import {
  type ModifierAttestationConformitéFormKeys,
  modifierAttestationConformitéAction,
} from './modifierAttestationConformité.action';

export type ModifierAttestationConformitéFormProps = {
  identifiantProjet: string;
  attestationConformité: AttestationConformitéFormInputProps['attestationConformité'];
  rapportAssocié: RapportAssociéFormInputProps['rapportAssocié'];
};

export const ModifierAttestationConformitéForm = ({
  identifiantProjet,
  attestationConformité,
  rapportAssocié,
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
      <AttestationConformitéFormInput
        validationErrors={validationErrors}
        attestationConformité={attestationConformité}
      />
      <RapportAssociéFormInput
        rapportAssocié={rapportAssocié}
        validationErrors={validationErrors}
      />
    </Form>
  );
};
