'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import { modifierProducteurAction, ModifierProducteurFormKeys } from './modifierProducteur.action';

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
        state={validationErrors['producteur'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['producteur']}
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
