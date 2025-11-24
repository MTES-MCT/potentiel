'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import { modifierNomProjetAction, ModifierNomProjetFormKeys } from './modifierNomProjet.action';

export type ModifierNomProjetFormProps = {
  nomProjet: string;
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
};

export const ModifierNomProjetForm: FC<ModifierNomProjetFormProps> = ({
  nomProjet,
  identifiantProjet,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierNomProjetFormKeys>
  >({});

  return (
    <Form
      action={modifierNomProjetAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
        },
      }}
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <div className="flex flex-col gap-6">
        <Input
          state={validationErrors['nomProjet'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['nomProjet']}
          label="Nouveau nom du projet"
          nativeInputProps={{
            name: 'nomProjet',
            defaultValue: nomProjet,
            required: true,
            'aria-required': true,
          }}
        />
      </div>
    </Form>
  );
};
