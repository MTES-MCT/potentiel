'use client';

import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Input from '@codegouvfr/react-dsfr/Input';

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

export const ModifierDispositifDeStockageForm: FC<ModifierDispositifDeStockageFormProps> = ({
  identifiantProjet,
  dispositifDeStockage,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierDispositifDeStockageFormKeys>
  >({});
  const [installationAvecDispositifDeStockage, setInstallationAvecDispositifDeStockage] = useState(
    dispositifDeStockage.installationAvecDispositifDeStockage,
  );

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
          onChange: (e) => setInstallationAvecDispositifDeStockage(e.target.value === 'true'),
        }}
        options={[
          { label: 'Oui', value: 'true' },
          { label: 'Non', value: 'false' },
        ]}
      />

      {installationAvecDispositifDeStockage && (
        <>
          <Input
            state={validationErrors['capaciteDuDispositifDeStockageEnKW'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['capaciteDuDispositifDeStockageEnKW']}
            label="Capacité du dispositif de stockage (en KW)"
            nativeInputProps={{
              name: 'capaciteDuDispositifDeStockageEnKW',
              defaultValue: dispositifDeStockage.capacitéDuDispositifDeStockageEnKW,
              required: true,
              'aria-required': true,
              disabled: !installationAvecDispositifDeStockage,
            }}
          />

          <Input
            state={validationErrors['puissanceDuDispositifDeStockageEnKW'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['puissanceDuDispositifDeStockageEnKW']}
            label="Puissance du dispositif de stockage (en KW)"
            nativeInputProps={{
              name: 'puissanceDuDispositifDeStockageEnKW',
              defaultValue: dispositifDeStockage.puissanceDuDispositifDeStockageEnKW,
              required: true,
              'aria-required': true,
              disabled: !installationAvecDispositifDeStockage,
            }}
          />
        </>
      )}
    </Form>
  );
};
