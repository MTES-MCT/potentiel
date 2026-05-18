'use client';

import { FC, useState } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  EnregistrerGarantiesFinancièresFormKeys,
  enregistrerGarantiesFinancièresAction,
} from '../../actuelles/enregistrer/enregistrerGarantiesFinancières.action';
import {
  GarantiesFinancièresFormInputs,
  GarantiesFinancièresFormInputsProps,
} from '../../components/GarantiesFinancièresFormInputs';
import {
  ModifierDépôtGarantiesFinancièresFormKeys,
  modifierDépôtGarantiesFinancièresAction,
} from '../modifier/modifierDépôtGarantiesFinancières.action';
import {
  SoumettreDépôtGarantiesFinancièresFormKeys,
  soumettreDépôtGarantiesFinancièresAction,
} from './soumettreDépôtGarantiesFinancières.action';

type Action =
  | typeof soumettreDépôtGarantiesFinancièresAction
  | typeof modifierDépôtGarantiesFinancièresAction
  | typeof enregistrerGarantiesFinancièresAction;

export type SoumettreDépôtGarantiesFinancièresFormProps = {
  identifiantProjet: string;
  action: Action;
  submitLabel: string;
  typesGarantiesFinancières: GarantiesFinancièresFormInputsProps['typesGarantiesFinancières'];
  dépôt?: PlainType<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel>;
};

export const SoumettreDépôtGarantiesFinancièresForm: FC<
  SoumettreDépôtGarantiesFinancièresFormProps
> = ({ identifiantProjet, action, submitLabel, typesGarantiesFinancières, dépôt }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<
      | ModifierDépôtGarantiesFinancièresFormKeys
      | SoumettreDépôtGarantiesFinancièresFormKeys
      | EnregistrerGarantiesFinancièresFormKeys
    >
  >({});

  return (
    <Form
      action={action}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel,
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

      <GarantiesFinancièresFormInputs
        id="type"
        name="type"
        typesGarantiesFinancières={typesGarantiesFinancières}
        actuelles={dépôt}
        validationErrors={validationErrors}
      />
    </Form>
  );
};
