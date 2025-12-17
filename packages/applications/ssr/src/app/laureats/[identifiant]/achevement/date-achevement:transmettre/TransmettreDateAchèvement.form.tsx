'use client';

import { FC, useState } from 'react';

import { DateTime } from '@potentiel-domain/common';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { InputDate } from '@/components/atoms/form/InputDate';

import {
  transmettreDateAchèvementAction,
  TransmettreDateAchèvementFormKeys,
} from './transmettreDateAchèvement.action';

export type TransmettreDateAchèvementFormProps = {
  identifiantProjet: string;
  lauréatNotifiéLe: DateTime.RawType;
};

export const TransmettreDateAchèvementForm: FC<TransmettreDateAchèvementFormProps> = ({
  identifiantProjet,
  lauréatNotifiéLe,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettreDateAchèvementFormKeys>
  >({});
  return (
    <Form
      action={transmettreDateAchèvementAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Transmettre',
      }}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <div className="max-w-sm">
        <InputDate
          label="Date d'achèvement"
          name="dateAchevement"
          min={DateTime.convertirEnValueType(lauréatNotifiéLe).ajouterNombreDeJours(1).formatter()}
          max={DateTime.now().formatter()}
          required
          state={validationErrors['dateAchevement'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['dateAchevement']}
        />
      </div>
    </Form>
  );
};
