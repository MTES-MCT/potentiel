'use client';

import { FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';

import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from '../modifier/modifierGestionnaireRéseauRaccordement/GestionnaireRéseauSelect';

import {
  importerDatesMiseEnServiceAction,
  ImporterDatesMiseEnServiceFormKeys,
} from './importDatesMiseEnService.action';

export type ModifierGestionnaireRéseauRaccordementFormProps = {
  identifiantGestionnaireRéseauActuel: string;
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['gestionnairesRéseau'];
};

export const ImporterDatesMiseEnServiceForm: FC<
  ModifierGestionnaireRéseauRaccordementFormProps
> = ({ identifiantGestionnaireRéseauActuel, listeGestionnairesRéseau }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ImporterDatesMiseEnServiceFormKeys>
  >({});

  const [identifiantGestionnaireReseau, setIdentifiantGestionnaireReseau] = useState(
    identifiantGestionnaireRéseauActuel,
  );

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={importerDatesMiseEnServiceAction}
      heading="Importer des dates de mise en service"
      pendingModal={{
        id: 'form-import-date-mise-en-service',
        title: 'Import en cours',
        children: 'Import des dates de mise en service en cours ...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      successMessage={'date(s) de mise en service transmise(s)'}
      actions={<SubmitButton>Importer</SubmitButton>}
    >
      <div className="flex flex-col gap-5">
        <div>
          <GestionnaireRéseauSelect
            id="identifiantGestionnaireReseau"
            name="identifiantGestionnaireReseau"
            gestionnairesRéseau={listeGestionnairesRéseau}
            identifiantGestionnaireRéseauActuel={identifiantGestionnaireRéseauActuel}
            onGestionnaireRéseauSelected={({ identifiantGestionnaireRéseau }) => {
              setIdentifiantGestionnaireReseau(identifiantGestionnaireRéseau);
            }}
          />
        </div>
        <div>
          <DownloadDocument
            className="mb-4"
            url={Routes.Gestionnaire.téléchargerRaccordementEnAttenteMiseEnService(
              identifiantGestionnaireReseau,
            )}
            format="csv"
            label="Télécharger la liste des raccordement en attente de mise en service"
          />
        </div>
      </div>
      <UploadDocument
        label="Fichier des dates de mise en service"
        format="csv"
        name="fichierDatesMiseEnService"
        id="fichierDatesMiseEnService"
        required
        state={validationErrors['fichierDatesMiseEnService'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['fichierDatesMiseEnService']}
      />
    </Form>
  );
};
