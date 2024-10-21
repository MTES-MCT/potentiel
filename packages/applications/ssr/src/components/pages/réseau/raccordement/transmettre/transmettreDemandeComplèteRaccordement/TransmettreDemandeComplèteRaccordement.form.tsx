'use client';

import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from '../../modifier/modifierGestionnaireRéseauRaccordement/GestionnaireRéseauSelect';

import {
  transmettreDemandeComplèteRaccordementAction,
  TransmettreDemandeComplèteRaccordementFormKeys,
} from './transmettreDemandeComplèteRaccordement.action';

export type TransmettreDemandeComplèteRaccordementFormProps = {
  identifiantProjet: string;
  identifiantGestionnaireRéseauActuel?: string;
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['listeGestionnairesRéseau'];
};

export const TransmettreDemandeComplèteRaccordementForm = ({
  identifiantProjet,
  identifiantGestionnaireRéseauActuel,
  listeGestionnairesRéseau,
}: TransmettreDemandeComplèteRaccordementFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettreDemandeComplèteRaccordementFormKeys>
  >({});

  const [selectedIdentifiantGestionnaireRéseau, setSelectedIdentifiantGestionnaireRéseau] =
    useState<string | undefined>(identifiantGestionnaireRéseauActuel);

  const alreadyHasAGestionnaireRéseau =
    identifiantGestionnaireRéseauActuel && identifiantGestionnaireRéseauActuel !== 'inconnu';

  const gestionnaireActuel = selectedIdentifiantGestionnaireRéseau
    ? listeGestionnairesRéseau.find(
        (gestionnaire) =>
          gestionnaire.identifiantGestionnaireRéseau === selectedIdentifiantGestionnaireRéseau,
      )
    : undefined;
  const format = gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement?.format ?? '';
  const légende = gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement?.légende ?? '';
  const expressionReguliere =
    gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement?.expressionReguliere;

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={transmettreDemandeComplèteRaccordementAction}
      heading="Transmettre une demande complète de raccordement"
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Raccordement.détail(identifiantProjet),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour aux dossiers de raccordement
          </Button>
          <SubmitButton>Transmettre</SubmitButton>
        </>
      }
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

      {alreadyHasAGestionnaireRéseau ? (
        <input
          type="hidden"
          name="identifiantGestionnaireReseau"
          value={identifiantGestionnaireRéseauActuel}
        />
      ) : (
        <GestionnaireRéseauSelect
          id="identifiantGestionnaireReseau"
          name="identifiantGestionnaireReseau"
          label="Gestionnaire de réseau"
          disabled={alreadyHasAGestionnaireRéseau ? true : undefined}
          identifiantGestionnaireRéseauActuel={identifiantGestionnaireRéseauActuel}
          listeGestionnairesRéseau={listeGestionnairesRéseau}
          state={validationErrors['identifiantGestionnaireReseau'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['identifiantGestionnaireReseau']}
          onGestionnaireRéseauSelected={({ identifiantGestionnaireRéseau }) =>
            setSelectedIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau)
          }
        />
      )}

      <Input
        label="Référence du dossier de raccordement du projet *"
        hintText={
          <div>
            {légende && <div>Format attendu : {légende}</div>}
            {format && <div className="italic">Exemple : {format}</div>}
          </div>
        }
        state={validationErrors['referenceDossier'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['referenceDossier']}
        nativeInputProps={{
          name: 'referenceDossier',
          required: true,
          'aria-required': true,
          placeholder: format ? `Exemple: ${format}` : `Renseigner l'identifiant`,
          pattern: expressionReguliere || undefined,
          className: 'uppercase placeholder:capitalize',
        }}
      />

      <Input
        label="Date de l'accusé de réception"
        state={validationErrors['dateQualification'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateQualification']}
        nativeInputProps={{
          type: 'date',
          name: 'dateQualification',
          max: new Date().toISOString().split('T').shift(),
          required: true,
          'aria-required': true,
        }}
      />

      <UploadDocument
        label="Accusé de réception de la demande complète de raccordement **"
        name="accuseReception"
        required
        state={validationErrors['accuseReception'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['accuseReception']}
      />
    </Form>
  );
};
