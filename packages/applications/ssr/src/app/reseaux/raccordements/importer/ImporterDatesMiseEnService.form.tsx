'use client';

import { FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from '../../../laureats/[identifiant]/raccordements/(raccordement-du-projet)/(gestionnaire-réseau)/GestionnaireRéseauSelect';

import {
  importerDatesMiseEnServiceAction,
  ImporterDatesMiseEnServiceFormKeys,
} from './importDatesMiseEnService.action';

export type ModifierGestionnaireRéseauRaccordementFormProps = {
  gestionnaireRéseauActuel: GestionnaireRéseauSelectProps['gestionnaireRéseauActuel'];
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['listeGestionnairesRéseau'];
};

export const ImporterDatesMiseEnServiceForm: FC<
  ModifierGestionnaireRéseauRaccordementFormProps
> = ({ gestionnaireRéseauActuel, listeGestionnairesRéseau }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ImporterDatesMiseEnServiceFormKeys>
  >({});

  const [identifiantGestionnaireReseau, setIdentifiantGestionnaireReseau] = useState(
    Option.match(gestionnaireRéseauActuel)
      .some<string>((grd) => grd.identifiantGestionnaireRéseau.codeEIC)
      .none(() => 'inconnu'),
  );

  return (
    <Form
      action={importerDatesMiseEnServiceAction}
      heading="Importer des dates de mise en service"
      pendingModal={{
        id: 'form-import-date-mise-en-service',
        title: 'Import en cours',
        children: 'Import des dates de mise en service en cours ...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Importer',
      }}
    >
      <GestionnaireRéseauSelect
        id="identifiantGestionnaireReseau"
        name="identifiantGestionnaireReseau"
        onGestionnaireRéseauSelected={(identifiantGestionnaireRéseau) => {
          setIdentifiantGestionnaireReseau(identifiantGestionnaireRéseau);
        }}
        listeGestionnairesRéseau={listeGestionnairesRéseau}
        gestionnaireRéseauActuel={gestionnaireRéseauActuel}
        disabled={listeGestionnairesRéseau.length === 1}
      />
      {listeGestionnairesRéseau.length === 1 && Option.isSome(gestionnaireRéseauActuel) && (
        <input
          type="hidden"
          name="identifiantGestionnaireReseau"
          value={gestionnaireRéseauActuel.identifiantGestionnaireRéseau.codeEIC}
        />
      )}
      <DownloadDocument
        className="mb-4"
        url={Routes.Gestionnaire.téléchargerRaccordementEnAttenteMiseEnService(
          identifiantGestionnaireReseau,
        )}
        format="csv"
        label="Télécharger la liste des raccordements en attente de mise en service"
      />
      <UploadNewOrModifyExistingDocument
        label="Fichier des dates de mise en service"
        formats={['csv']}
        name="fichierDatesMiseEnService"
        required
        state={validationErrors['fichierDatesMiseEnService'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['fichierDatesMiseEnService']}
      />
    </Form>
  );
};
