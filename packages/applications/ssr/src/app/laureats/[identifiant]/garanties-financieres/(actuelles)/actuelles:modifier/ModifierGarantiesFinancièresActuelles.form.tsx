'use client';

import { FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  GarantiesFinancièresFormInputs,
  GarantiesFinancièresFormInputsProps,
} from '../../GarantiesFinancièresFormInputs';

import {
  modifierGarantiesFinancièresActuellesAction,
  ModifierGarantiesFinancièresFormKeys,
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
          href: Routes.GarantiesFinancières.détail(identifiantProjet),
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
