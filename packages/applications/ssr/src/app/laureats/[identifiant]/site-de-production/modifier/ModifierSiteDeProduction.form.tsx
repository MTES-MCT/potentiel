'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { CommunePicker } from '@/components/molecules/CommunePicker';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import {
  modifierSiteDeProductionAction,
  ModifierSiteDeProductionFormKeys,
} from './modifierSiteDeProduction.action';

export type ModifierSiteDeProductionFormProps = {
  lauréat: PlainType<Lauréat.ConsulterLauréatReadModel>;
  rôle: PlainType<Role.ValueType>;
};

export const ModifierSiteDeProductionForm: FC<ModifierSiteDeProductionFormProps> = ({
  lauréat: { identifiantProjet, localité },
  rôle,
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
  const [changementRégionConfirmé, setChangementRégionConfirmé] = useState(false);
  const originalRegion = localité.région;

  const nécessiteLaConfirmationPourChangementDeRégion =
    Role.bind(rôle).estDreal() && originalRegion != commune.region;

  return (
    <Form
      action={modifierSiteDeProductionAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        submitDisabled: nécessiteLaConfirmationPourChangementDeRégion && !changementRégionConfirmé,
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
          label="Raison de la modification"
          hintText="Indiquez la raison de cette modification si nécessaire"
          nativeTextAreaProps={{
            name: 'raison',
            defaultValue: '',
          }}
        />
        <UploadNewOrModifyExistingDocument
          label="Pièce justificative (optionnel)"
          name="piecesJustificatives"
          hintText="Joindre vos justificatifs"
          multiple
          formats={['pdf']}
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
        />
      </div>
      {nécessiteLaConfirmationPourChangementDeRégion && (
        <>
          <Alert
            small
            className="mt-8"
            severity="warning"
            description={
              <p>
                La gestion de ce projet sera transférée à la région{' '}
                <span className="font-semilbold">{commune.region}</span>
              </p>
            }
          />
          <Checkbox
            small
            className="mt-2"
            options={[
              {
                label: `J'ai compris que ce changement entraînera la perte de mes accès à ce projet`,
                nativeInputProps: {
                  name: 'accesAuProjetPerdu',
                  checked: changementRégionConfirmé,
                  onChange: (e) => setChangementRégionConfirmé(e.target.checked),
                },
              },
            ]}
          />
        </>
      )}
    </Form>
  );
};
