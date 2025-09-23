'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  modifierInstallateurAction,
  ModifierInstallateurFormKeys,
} from './modifierInstallateur.action';

export type ModifierInstallateurFormProps =
  PlainType<Lauréat.Installateur.ConsulterInstallateurReadModel>;

export const ModifierInstallateurForm: FC<ModifierInstallateurFormProps> = ({
  identifiantProjet,
  installateur,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierInstallateurFormKeys>
  >({});

  return (
    <Form
      action={modifierInstallateurAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitButtonLabel: 'Modifier',
        backButton: {
          url: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
          label: 'Retour à la page projet',
        },
      }}
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <Input
        state={validationErrors['installateur'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['installateur']}
        label="Identité de l'installateur"
        nativeInputProps={{
          name: 'installateur',
          defaultValue: installateur,
          required: true,
          'aria-required': true,
        }}
      />
    </Form>
  );
};
