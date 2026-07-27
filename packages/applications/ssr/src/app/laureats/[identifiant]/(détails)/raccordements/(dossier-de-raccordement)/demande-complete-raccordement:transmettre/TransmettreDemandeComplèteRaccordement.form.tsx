'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import type { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { Icon } from '@/components/atoms/Icon';
import { Link } from '@/components/atoms/LinkNoPrefetch';
import type { ValidationErrors } from '@/utils/formAction';
import {
  GestionnaireRéseauSelect,
  type GestionnaireRéseauSelectProps,
} from '../../(raccordement-du-projet)/(gestionnaire-réseau)/GestionnaireRéseauSelect';
import { RéférenceDossierInput } from '../components/RéférenceDossierInput';
import {
  type TransmettreDemandeComplèteRaccordementFormKeys,
  transmettreDemandeComplèteRaccordementAction,
} from './transmettreDemandeComplèteRaccordement.action';

export type TransmettreDemandeComplèteRaccordementFormProps = {
  identifiantProjet: PlainType<IdentifiantProjet.RawType>;
  gestionnaireRéseauActuel: GestionnaireRéseauSelectProps['gestionnaireRéseauActuel'];
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['listeGestionnairesRéseau'];
  aDéjàTransmisUneDemandeComplèteDeRaccordement: boolean;
};

export const TransmettreDemandeComplèteRaccordementForm = ({
  identifiantProjet,
  gestionnaireRéseauActuel,
  listeGestionnairesRéseau,
  aDéjàTransmisUneDemandeComplèteDeRaccordement,
}: TransmettreDemandeComplèteRaccordementFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettreDemandeComplèteRaccordementFormKeys>
  >({});

  const identifiantGestionnaireRéseauActuel = Option.match(gestionnaireRéseauActuel)
    .some<string | undefined>((grd) => grd.identifiantGestionnaireRéseau.codeEIC)
    .none(() => undefined);

  const [selectedIdentifiantGestionnaireRéseau, setSelectedIdentifiantGestionnaireRéseau] =
    useState<string | undefined>(identifiantGestionnaireRéseauActuel);

  const aideSaisieRéférenceDossierRaccordement = selectedIdentifiantGestionnaireRéseau
    ? listeGestionnairesRéseau.find(
        (gestionnaire) =>
          gestionnaire.identifiantGestionnaireRéseau.codeEIC ===
          selectedIdentifiantGestionnaireRéseau,
      )?.aideSaisieRéférenceDossierRaccordement
    : undefined;

  return (
    <Form
      action={transmettreDemandeComplèteRaccordementAction}
      heading="Transmettre une demande complète de raccordement"
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Transmettre',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

      {Option.isSome(gestionnaireRéseauActuel) ? (
        <div className="flex flex-col">
          <div className="flex gap-3">
            <legend className="font-bold">Gestionnaire réseau actuel</legend>
            {aDéjàTransmisUneDemandeComplèteDeRaccordement ? null : (
              <Link href={Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet)}>
                <Icon id="fr-icon-edit-box-line" size="sm" /> Modifier
              </Link>
            )}
          </div>
          <div className="flex flex-col">
            {gestionnaireRéseauActuel.raisonSociale} (
            {gestionnaireRéseauActuel.identifiantGestionnaireRéseau.codeEIC})
          </div>
        </div>
      ) : (
        <GestionnaireRéseauSelect
          id="identifiantGestionnaireReseau"
          name="identifiantGestionnaireReseau"
          label="Gestionnaire de réseau"
          listeGestionnairesRéseau={listeGestionnairesRéseau}
          gestionnaireRéseauActuel={gestionnaireRéseauActuel}
          state={validationErrors['identifiantGestionnaireReseau'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['identifiantGestionnaireReseau']}
          onGestionnaireRéseauSelected={(identifiantGestionnaireRéseau) =>
            setSelectedIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau)
          }
        />
      )}

      <RéférenceDossierInput
        name="referenceDossier"
        aideSaisie={aideSaisieRéférenceDossierRaccordement}
        validationErrors={validationErrors}
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

      <UploadNewOrModifyExistingDocument
        label="Accusé de réception de la demande complète de raccordement **"
        name="accuseReception"
        required
        formats={['pdf']}
        state={validationErrors['accuseReception'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['accuseReception']}
      />
    </Form>
  );
};
