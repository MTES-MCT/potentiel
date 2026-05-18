'use client';

import { type FC, useState } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import {
  GarantiesFinancièresFormInputs,
  type GarantiesFinancièresFormInputsProps,
} from '../../components/GarantiesFinancièresFormInputs';
import {
  type ModifierGarantiesFinancièresFormKeys,
  modifierGarantiesFinancièresActuellesAction,
} from './modifierGarantiesFinancièresActuelles.action';

export type ModifierGarantiesFinancièresActuellesFormProps = {
  typesGarantiesFinancières: GarantiesFinancièresFormInputsProps['typesGarantiesFinancières'];
  actuelles: PlainType<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
};

export const ModifierGarantiesFinancièresActuellesForm: FC<
  ModifierGarantiesFinancièresActuellesFormProps
> = ({ typesGarantiesFinancières, actuelles }) => {
  const identifiantProjet = IdentifiantProjet.bind(actuelles.identifiantProjet).formatter();
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierGarantiesFinancièresFormKeys>
  >({});

  return (
    <Form
      action={modifierGarantiesFinancièresActuellesAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />

      <GarantiesFinancièresFormInputs
        id="type"
        name="type"
        validationErrors={validationErrors}
        typesGarantiesFinancières={typesGarantiesFinancières}
        actuelles={actuelles}
      />
    </Form>
  );
};
