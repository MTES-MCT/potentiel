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
};

export const TransmettreDateAchèvementForm: FC<TransmettreDateAchèvementFormProps> = ({
  identifiantProjet,
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

      <div>
        <InputDate
          label="Date d'achèvement"
          name="dateAchevement"
          max={DateTime.now().formatter()}
          required
          state={validationErrors['dateAchevement'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['dateAchevement']}
        />
      </div>
    </Form>
  );
};
