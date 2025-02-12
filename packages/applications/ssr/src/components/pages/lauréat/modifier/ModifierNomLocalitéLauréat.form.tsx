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
import { Heading4 } from '@/components/atoms/headings';

import {
  modifierNomLocalitéLauréatAction,
  ModifierNomLocalitéLauréatFormKeys,
} from './modifierNomLocalitéLauréat.action';

export type ModifierNomLocalitéLauréatFormProps = Pick<
  PlainType<Lauréat.ConsulterLauréatReadModel>,
  'identifiantProjet' | 'nomProjet' | 'localité'
>;

export const ModifierNomLocalitéLauréatForm = ({
  identifiantProjet,
  nomProjet,
  localité,
}: ModifierNomLocalitéLauréatFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierNomLocalitéLauréatFormKeys>
  >({});

  return (
    <Form
      action={modifierNomLocalitéLauréatAction}
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
      <Heading4>Nom du projet</Heading4>
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
      <Heading4>Site de production</Heading4>

      <div className="flex flex-col gap-1">
        <Input
          state={validationErrors['adresse1'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['adresse1']}
          label="Adresse 1"
          nativeInputProps={{
            name: 'adresse1',
            defaultValue: localité.adresse1,
            required: true,
            'aria-required': true,
          }}
        />
        <Input
          state={validationErrors['adresse2'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['adresse2']}
          label="Adresse 2"
          nativeInputProps={{
            name: 'adresse2',
            defaultValue: localité.adresse2,
          }}
        />
        <Input
          state={validationErrors['codePostal'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['codePostal']}
          label="Code Postal"
          nativeInputProps={{
            name: 'codePostal',
            defaultValue: localité.codePostal,
            required: true,
            'aria-required': true,
          }}
        />
        <Input
          state={validationErrors['commune'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['commune']}
          label="Commune"
          nativeInputProps={{
            name: 'commune',
            defaultValue: localité.commune,
            required: true,
            'aria-required': true,
          }}
        />
      </div>
    </Form>
  );
};
