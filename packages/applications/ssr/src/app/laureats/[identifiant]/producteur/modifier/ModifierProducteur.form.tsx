'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import { type FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import type { ValidationErrors } from '@/utils/formAction';
import {
  type ModifierProducteurFormKeys,
  modifierProducteurAction,
} from './modifierProducteur.action';

export type ModifierProducteurFormProps =
  PlainType<Lauréat.Producteur.ConsulterProducteurReadModel>;

export const ModifierProducteurForm: FC<ModifierProducteurFormProps> = ({
  identifiantProjet,
  producteur,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierProducteurFormKeys>
  >({});

  return (
    <Form
      action={modifierProducteurAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour à la page projet
          </Button>
          <SubmitButton>Modifier</SubmitButton>
        </>
      }
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <Input
        state={validationErrors.producteur ? 'error' : 'default'}
        stateRelatedMessage={validationErrors.producteur}
        label="Producteur"
        nativeInputProps={{
          name: 'producteur',
          defaultValue: producteur,
          required: true,
          'aria-required': true,
        }}
      />
    </Form>
  );
};
