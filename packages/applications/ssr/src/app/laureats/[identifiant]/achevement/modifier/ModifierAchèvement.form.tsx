'use client';

import { useState } from 'react';

import { DocumentProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  AttestationConformitéFormInput,
  DateAchèvementForm,
  PreuveTransmissionAuCocontractantFormInput,
} from '../AttestationConformité.inputs';

import { modifierAchèvementAction, ModifierAchèvementFormKeys } from './modifierAchèvement.action';

export type ModifierAchèvementFormProps = {
  identifiantProjet: string;
  attestationConformité?: DocumentProjet.RawType;
  dateTransmissionAuCocontractant: DateTime.RawType;
  preuveTransmissionAuCocontractant?: DocumentProjet.RawType;
  lauréatNotifiéLe: DateTime.RawType;
};

export const ModifierAchèvementForm = ({
  identifiantProjet,
  attestationConformité,
  dateTransmissionAuCocontractant,
  preuveTransmissionAuCocontractant,
  lauréatNotifiéLe,
}: ModifierAchèvementFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierAchèvementFormKeys>
  >({});

  return (
    <Form
      action={modifierAchèvementAction}
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
        attestationConformité={attestationConformité}
        validationErrors={validationErrors}
        optionnel
      />
      <PreuveTransmissionAuCocontractantFormInput
        preuveTransmissionAuCocontractant={preuveTransmissionAuCocontractant}
        validationErrors={validationErrors}
        optionnel
      />
      <DateAchèvementForm
        validationErrors={validationErrors}
        lauréatNotifiéLe={lauréatNotifiéLe}
        dateTransmissionAuCocontractant={dateTransmissionAuCocontractant}
      />
    </Form>
  );
};
