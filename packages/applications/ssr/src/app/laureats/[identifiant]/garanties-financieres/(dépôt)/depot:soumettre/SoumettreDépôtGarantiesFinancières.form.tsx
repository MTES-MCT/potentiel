'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  GarantiesFinancièresFormInputs,
  GarantiesFinancièresFormInputsProps,
} from '../../TypeGarantiesFinancièresSelect';
import {
  enregistrerGarantiesFinancièresAction,
  EnregistrerGarantiesFinancièresFormKeys,
} from '../../(actuelles)/actuelles:enregistrer/enregistrerGarantiesFinancières.action';
import {
  modifierDépôtGarantiesFinancièresAction,
  ModifierDépôtGarantiesFinancièresFormKeys,
} from '../depot:modifier/modifierDépôtGarantiesFinancières.action';

import {
  soumettreDépôtGarantiesFinancièresAction,
  SoumettreDépôtGarantiesFinancièresFormKeys,
} from './soumettreDépôtGarantiesFinancières.action';

type Action =
  | typeof soumettreDépôtGarantiesFinancièresAction
  | typeof modifierDépôtGarantiesFinancièresAction
  | typeof enregistrerGarantiesFinancièresAction;

export type SoumettreDépôtGarantiesFinancièresFormProps = {
  identifiantProjet: string;
  action: Action;
  submitButtonLabel: string;
  typesGarantiesFinancières: GarantiesFinancièresFormInputsProps['typesGarantiesFinancières'];
  dépôt?: PlainType<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel>;
};

export const SoumettreDépôtGarantiesFinancièresForm: FC<
  SoumettreDépôtGarantiesFinancièresFormProps
> = ({ identifiantProjet, action, submitButtonLabel, typesGarantiesFinancières, dépôt }) => {
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
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.GarantiesFinancières.détail(identifiantProjet),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour au détail des garanties financières
          </Button>
          <SubmitButton>{submitButtonLabel}</SubmitButton>
        </>
      }
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
