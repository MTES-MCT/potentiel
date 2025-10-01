'use client';

import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  modifierDispositifDeStockageAction,
  ModifierDispositifDeStockageFormKeys,
} from './modifierDispositifDeStockage.action';

export type ModifierDispositifDeStockageFormProps =
  PlainType<Lauréat.DispositifDeStockage.ConsulterDispositifDeStockageReadModel>;

// viovio ajouter ici les valeurs optionnels si l'installation est true
export const ModifierDispositifDeStockageForm: FC<ModifierDispositifDeStockageFormProps> = ({
  identifiantProjet,
  dispositifDeStockage,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierDispositifDeStockageFormKeys>
  >({});

  return (
    <Form
      action={modifierDispositifDeStockageAction}
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

      <Select
        className="w-fit"
        state={validationErrors['installationAvecDispositifDeStockage'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['installationAvecDispositifDeStockage']}
        label="Installation couplée à un dispositif de stockage"
        nativeSelectProps={{
          name: 'installationAvecDispositifDeStockage',
          defaultValue: dispositifDeStockage.installationAvecDispositifDeStockage
            ? 'true'
            : 'false',
          required: true,
          'aria-required': true,
        }}
        options={[
          { label: 'Avec', value: 'true' },
          { label: 'Sans', value: 'false' },
        ]}
      />
    </Form>
  );
};
