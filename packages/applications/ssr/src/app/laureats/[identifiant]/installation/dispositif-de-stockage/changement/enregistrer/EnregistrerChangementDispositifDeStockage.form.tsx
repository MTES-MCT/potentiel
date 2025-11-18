'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  enregistrerChangementDispositifDeStockageAction,
  EnregistrerChangementDispositifDeStockageFormKeys,
} from './enregistrerChangementDispositifDeStockage.action';
import { EnregistrerChangementDispositifDeStockagePageProps } from './EnregistrerChangementDispositifDeStockage.page';

export type EnregistrerChangementDispositifDeStockageFormProps =
  EnregistrerChangementDispositifDeStockagePageProps;

export const EnregistrerChangementDispositifDeStockageForm: FC<
  EnregistrerChangementDispositifDeStockageFormProps
> = ({ identifiantProjet, dispositifDeStockage }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<EnregistrerChangementDispositifDeStockageFormKeys>
  >({});

  const [installationAvecDispositifDeStockage, setInstallationAvecDispositifDeStockage] = useState(
    dispositifDeStockage.installationAvecDispositifDeStockage,
  );

  return (
    <Form
      action={enregistrerChangementDispositifDeStockageAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Confirmer',
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
              state={validationErrors['capaciteDuDispositifDeStockageEnKWh'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['capaciteDuDispositifDeStockageEnKWh']}
              label="Capacité du dispositif de stockage (en kWh)"
              className="w-fit"
              nativeInputProps={{
                name: 'capaciteDuDispositifDeStockageEnKWh',
                defaultValue: dispositifDeStockage.capacitéDuDispositifDeStockageEnKWh,
                required: true,
                'aria-required': true,
                disabled: !installationAvecDispositifDeStockage,
                type: 'number',
                inputMode: 'decimal',
                pattern: '[0-9]+([,.][0-9]+)?',
                step: 'any',
              }}
            />

            <Input
              state={validationErrors['puissanceDuDispositifDeStockageEnKW'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['puissanceDuDispositifDeStockageEnKW']}
              label="Puissance du dispositif de stockage (en kW)"
              className="w-fit"
              nativeInputProps={{
                name: 'puissanceDuDispositifDeStockageEnKW',
                defaultValue: dispositifDeStockage.puissanceDuDispositifDeStockageEnKW,
                required: true,
                'aria-required': true,
                disabled: !installationAvecDispositifDeStockage,
                type: 'number',
                inputMode: 'decimal',
                pattern: '[0-9]+([,.][0-9]+)?',
                step: 'any',
              }}
            />
          </>
        )}

        <Input
          textArea
          label="Raison"
          id="raison"
          hintText="Veuillez détailler les raisons ayant conduit au changement."
          nativeTextAreaProps={{
            name: 'raison',
            required: true,
            'aria-required': true,
          }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
        <UploadNewOrModifyExistingDocument
          required
          label="Pièce justificative"
          name="piecesJustificatives"
          formats={['pdf']}
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
        />
      </div>
    </Form>
  );
};
