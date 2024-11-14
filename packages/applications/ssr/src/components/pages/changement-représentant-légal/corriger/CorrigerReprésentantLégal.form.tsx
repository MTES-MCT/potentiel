'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  corrigerReprésentantLégalAction,
  CorrigerReprésentantLégalFormKeys,
} from './corrigerReprésentantLégal.action';

export type CorrigerReprésentantLégalFormProps = {
  identifiantProjet: string;
  nomRepresentantLegal: string;
};

export const CorrigerReprésentantLégalForm: FC<CorrigerReprésentantLégalFormProps> = ({
  identifiantProjet,
  nomRepresentantLegal,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerReprésentantLégalFormKeys>
  >({});

  return (
    <Form
      action={corrigerReprésentantLégalAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={<SubmitButton>Corriger</SubmitButton>}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <Input
        label="Nom du représentant légal"
        id="nomRepresentantLegal"
        hintText={`Veuillez préciser le nom pour le nouveau représentant légal du projet`}
        nativeInputProps={{
          name: 'nomRepresentantLegal',
          required: true,
          'aria-required': true,
          defaultValue: nomRepresentantLegal,
        }}
        state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomRepresentantLegal']}
      />
    </Form>
  );
};
