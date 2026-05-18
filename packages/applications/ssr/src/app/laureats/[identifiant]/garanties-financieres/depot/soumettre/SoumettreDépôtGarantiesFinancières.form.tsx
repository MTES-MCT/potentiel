'use client';

import { type FC, useState } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import type {
  EnregistrerGarantiesFinancièresFormKeys,
  enregistrerGarantiesFinancièresAction,
} from '../../actuelles/enregistrer/enregistrerGarantiesFinancières.action';
import {
  GarantiesFinancièresFormInputs,
  type GarantiesFinancièresFormInputsProps,
} from '../../components/GarantiesFinancièresFormInputs';
import type {
  ModifierDépôtGarantiesFinancièresFormKeys,
  modifierDépôtGarantiesFinancièresAction,
} from '../modifier/modifierDépôtGarantiesFinancières.action';
import type {
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
