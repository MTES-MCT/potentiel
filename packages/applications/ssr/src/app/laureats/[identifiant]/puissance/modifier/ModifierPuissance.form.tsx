'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import { modifierPuissanceAction, ModifierPuissanceFormKeys } from './modifierPuissance.action';

export type ModifierPuissanceFormProps = PlainType<
  Pick<
    Lauréat.Puissance.ConsulterPuissanceReadModel,
    'identifiantProjet' | 'puissance' | 'unitéPuissance'
  >
>;

export const ModifierPuissanceForm: FC<ModifierPuissanceFormProps> = ({
  identifiantProjet,
  puissance,
  unitéPuissance: { unité: unitéPuissance },
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierPuissanceFormKeys>
  >({});

  return (
    <Form
      action={modifierPuissanceAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        back: {
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
          label: 'Retour à la page projet',
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
          state={validationErrors['puissance'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['puissance']}
          label={`Puissance (en ${unitéPuissance})`}
          nativeInputProps={{
            name: 'puissance',
            defaultValue: puissance,
            required: true,
            'aria-required': true,
            type: 'number',
            inputMode: 'decimal',
            pattern: '[0-9]+([.][0-9]+)?',
            step: 'any',
          }}
        />
        <Input
          textArea
          label={`Raison (optionnel)`}
          id="raison"
          hintText="Veuillez détailler les raisons ayant conduit au changement de puissance."
          nativeTextAreaProps={{ name: 'raison', required: false, 'aria-required': true }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
      </div>
    </Form>
  );
};
