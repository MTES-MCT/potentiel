'use client';
import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/laureat';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import { modifierNomProjetAction, ModifierNomProjetFormKeys } from './modifierNomProjet.action';

export type ModifierNomProjetFormProps = Pick<
  PlainType<Lauréat.ConsulterLauréatReadModel>,
  'identifiantProjet' | 'nomProjet'
>;

export const ModifierNomProjetForm = ({
  identifiantProjet,
  nomProjet,
}: ModifierNomProjetFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierNomProjetFormKeys>
  >({});

  return (
    <Form
      action={modifierNomProjetAction}
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
          state={validationErrors['nomProjet'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['nomProjet']}
          label="Nouveau nom"
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
