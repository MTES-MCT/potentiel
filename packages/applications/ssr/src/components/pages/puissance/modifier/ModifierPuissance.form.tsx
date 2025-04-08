'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import { modifierPuissanceAction, ModifierPuissanceFormKeys } from './modifierPuissance.action';

export type ModifierPuissanceFormProps = PlainType<Puissance.ConsulterPuissanceReadModel>;

export const ModifierPuissanceForm: FC<ModifierPuissanceFormProps> = ({
  identifiantProjet,
  puissance,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierPuissanceFormKeys>
  >({});

  return (
    <Form
      action={modifierPuissanceAction}
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

      <div className="flex flex-col gap-6">
        <Input
          state={validationErrors['puissance'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['puissance']}
          label="Puissance (en MWc)"
          nativeInputProps={{
            name: 'puissance',
            defaultValue: puissance,
            required: true,
            'aria-required': true,
            inputMode: 'decimal',
            pattern: '[0-9]+([.][0-9]+)?',
            step: 0.1,
            type: 'number',
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
