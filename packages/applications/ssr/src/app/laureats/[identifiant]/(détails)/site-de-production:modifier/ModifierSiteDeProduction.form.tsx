'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';
import { CommunePicker } from '@/components/molecules/CommunePicker';

import {
  modifierSiteDeProductionAction,
  ModifierSiteDeProductionFormKeys,
} from './modifierSiteDeProduction.action';

export type ModifierSiteDeProductionFormProps = Pick<
  PlainType<Lauréat.ConsulterLauréatReadModel>,
  'identifiantProjet' | 'localité'
>;

export const ModifierSiteDeProductionForm: FC<ModifierSiteDeProductionFormProps> = ({
  identifiantProjet,
  localité,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierSiteDeProductionFormKeys>
  >({});

  const [commune, setCommune] = useState({
    commune: localité.commune,
    codePostal: localité.codePostal,
    departement: localité.département,
    region: localité.région,
  });

  return (
    <Form
      action={modifierSiteDeProductionAction}
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
          state={validationErrors['adresse1'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['adresse1']}
          label="N°, voie, lieu-dit 1"
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
          label="N°, voie, lieu-dit 2"
          nativeInputProps={{
            name: 'adresse2',
            defaultValue: localité.adresse2,
          }}
        />

        <div className="flex flex-row gap-2 justify-between">
          <CommunePicker
            defaultValue={commune}
            label="Commune"
            nativeInputProps={{
              required: true,
              'aria-required': true,
            }}
            onSelected={(commune) => commune && setCommune(commune)}
            className="mb-6 flex-1"
          />
          <Input
            state={validationErrors['codePostal'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['codePostal']}
            label="Code Postal"
            nativeInputProps={{
              name: 'codePostal',
              value: commune.codePostal,
              onChange: (e) => setCommune((c) => ({ ...c, codePostal: e.target.value })),
              required: true,
              'aria-required': true,
              minLength: 5,
              maxLength: 5,
            }}
          />
        </div>
        <input type="hidden" value={commune.commune} name="commune" />
        {validationErrors['commune']}
        <input type="hidden" value={commune.departement} name="departement" />
        {validationErrors['departement']}
        <input type="hidden" value={commune.region} name="region" />
        {validationErrors['region']}
      </div>
      <div>
        <Input
          textArea
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
          label="Raison de la modification (optionnel)"
          hintText="Indiquez la raison de cette modification si nécessaire"
          nativeTextAreaProps={{
            name: 'raison',
            defaultValue: '',
          }}
        />
      </div>
    </Form>
  );
};
