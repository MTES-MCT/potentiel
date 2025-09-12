'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  modifierInstallationAvecDispositifDeStockageAction,
  ModifierInstallationAvecDispositifDeStockageFormKeys,
} from './modifierInstallationAvecDispositifDeStockage.action';

export type ModifierInstallationAvecDispositifDeStockageFormProps =
  PlainType<Lauréat.InstallationAvecDispositifDeStockage.ConsulterInstallationAvecDispositifDeStockageReadModel>;

export const ModifierInstallationAvecDispositifDeStockageForm: FC<
  ModifierInstallationAvecDispositifDeStockageFormProps
> = ({ identifiantProjet, installationAvecDispositifDeStockage }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierInstallationAvecDispositifDeStockageFormKeys>
  >({});

  return (
    <Form
      action={modifierInstallationAvecDispositifDeStockageAction}
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

      <Select
        state={validationErrors['installationAvecDispositifDeStockage'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['installationAvecDispositifDeStockage']}
        label="Installation couplée à un dispositif de stockage"
        nativeSelectProps={{
          name: 'installationAvecDispositifDeStockage',
          defaultValue: installationAvecDispositifDeStockage ? 'true' : 'false',
          required: true,
          'aria-required': true,
        }}
        options={[
          { label: 'Oui', value: 'true' },
          { label: 'Non', value: 'false' },
        ]}
      />
    </Form>
  );
};
