'use client';

import { type FC, useState } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Option } from '@potentiel-libraries/monads';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import {
  GestionnaireRéseauSelect,
  type GestionnaireRéseauSelectProps,
} from '../../../../(raccordement-du-projet)/(gestionnaire-réseau)/GestionnaireRéseauSelect';
import { AccuséRéceptionInput } from '../../../components/AccuséRéceptionInput';
import { RéférenceDossierInput } from '../../../components/RéférenceDossierInput';
import {
  type ModifierDemandeComplèteRaccordementFormKeys,
  modifierDemandeComplèteRaccordementAction,
} from './modifierDemandeComplèteRaccordement.action';

export type ModifierDemandeComplèteRaccordementFormProps = {
  identifiantProjet: string;
  raccordement: {
    référence: string;
    demandeComplèteRaccordement: {
      dateQualification?: Iso8601DateTime;
      accuséRéception?: string;
    };
  };
  gestionnaireRéseauActuel?: PlainType<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel>;
  listeGestionnairesRéseau?: GestionnaireRéseauSelectProps['listeGestionnairesRéseau'];
};

export const ModifierDemandeComplèteRaccordementForm: FC<
  ModifierDemandeComplèteRaccordementFormProps
> = ({
  identifiantProjet,
  gestionnaireRéseauActuel,
  raccordement: {
    référence,
    demandeComplèteRaccordement: { accuséRéception, dateQualification },
  },
  listeGestionnairesRéseau,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierDemandeComplèteRaccordementFormKeys>
  >({});

  const [selectedIdentifiantGestionnaireRéseau, setSelectedIdentifiantGestionnaireRéseau] =
    useState<string | undefined>(gestionnaireRéseauActuel?.identifiantGestionnaireRéseau.codeEIC);

  const aideSaisieRéférenceDossierRaccordement = selectedIdentifiantGestionnaireRéseau
    ? selectedIdentifiantGestionnaireRéseau ===
      gestionnaireRéseauActuel?.identifiantGestionnaireRéseau.codeEIC
      ? gestionnaireRéseauActuel.aideSaisieRéférenceDossierRaccordement
      : listeGestionnairesRéseau?.find(
          (gestionnaire) =>
            gestionnaire.identifiantGestionnaireRéseau.codeEIC ===
            selectedIdentifiantGestionnaireRéseau,
        )?.aideSaisieRéférenceDossierRaccordement
    : undefined;

  return (
    <Form
      action={modifierDemandeComplèteRaccordementAction}
      heading="Modifier une demande complète de raccordement"
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />
      <input name="referenceDossierRaccordementActuelle" type="hidden" value={référence} />
      <input name="dateQualificationActuelle" type="hidden" value={dateQualification} />

      <div>
        Gestionnaire réseau :{' '}
        {gestionnaireRéseauActuel ? (
          <strong>
            {gestionnaireRéseauActuel.raisonSociale} (
            {gestionnaireRéseauActuel.identifiantGestionnaireRéseau.codeEIC})
          </strong>
        ) : (
          <span>non renseigné</span>
        )}
      </div>

      {!gestionnaireRéseauActuel && listeGestionnairesRéseau && (
        <GestionnaireRéseauSelect
          id="identifiantGestionnaireReseau"
          name="identifiantGestionnaireReseau"
          label="Gestionnaire de réseau"
          listeGestionnairesRéseau={listeGestionnairesRéseau}
          gestionnaireRéseauActuel={Option.none}
          state={validationErrors['identifiantGestionnaireReseau'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['identifiantGestionnaireReseau']}
          onGestionnaireRéseauSelected={(identifiantGestionnaireRéseau) =>
            setSelectedIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau)
          }
        />
      )}

      <RéférenceDossierInput
        name="referenceDossier"
        defaultValue={référence ?? ''}
        aideSaisie={aideSaisieRéférenceDossierRaccordement}
        validationErrors={validationErrors}
      />

      <AccuséRéceptionInput
        validationErrors={validationErrors}
        date={dateQualification}
        documentKey={accuséRéception}
      />
    </Form>
  );
};
