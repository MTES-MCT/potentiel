'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';
import { Option } from '@potentiel-libraries/monads';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { InputDate } from '@/components/atoms/form/InputDate';
import { ValidationErrors } from '@/utils/formAction';

import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from '../../../../(raccordement-du-projet)/(gestionnaire-réseau)/GestionnaireRéseauSelect';

import {
  modifierDemandeComplèteRaccordementAction,
  ModifierDemandeComplèteRaccordementFormKeys,
} from './modifierDemandeComplèteRaccordement.action';

export type ModifierDemandeComplèteRaccordementFormProps = {
  identifiantProjet: string;
  raccordement: {
    référence: {
      value: string;
      canEdit: boolean;
    };
    demandeComplèteRaccordement: {
      canEdit: boolean;
      dateQualification?: Iso8601DateTime;
      accuséRéception?: string;
    };
  };
  gestionnaireRéseauActuel?: {
    identifiantGestionnaireRéseau: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement?: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  };

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
    useState<string | undefined>(gestionnaireRéseauActuel?.identifiantGestionnaireRéseau);

  const aideSaisieRéférenceDossierRaccordement = selectedIdentifiantGestionnaireRéseau
    ? listeGestionnairesRéseau?.find(
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
      <input name="referenceDossierRaccordementActuelle" type="hidden" value={référence.value} />
      <input name="dateQualificationActuelle" type="hidden" value={dateQualification} />

      <div>
        Gestionnaire réseau :{' '}
        {gestionnaireRéseauActuel ? (
          <strong>
            {gestionnaireRéseauActuel.raisonSociale} (
            {gestionnaireRéseauActuel.identifiantGestionnaireRéseau})
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

      {référence.canEdit ? (
        <Input
          id="referenceDossierRaccordement"
          label="Référence du dossier de raccordement du projet *"
          hintText={
            aideSaisieRéférenceDossierRaccordement && (
              <>
                {!Option.isNone(aideSaisieRéférenceDossierRaccordement.format) && (
                  <div className="m-0">
                    Format attendu : {aideSaisieRéférenceDossierRaccordement.format}
                  </div>
                )}
                {!Option.isNone(aideSaisieRéférenceDossierRaccordement.légende) && (
                  <div className="m-0 italic">
                    Exemple : {aideSaisieRéférenceDossierRaccordement.légende}
                  </div>
                )}
              </>
            )
          }
          state={validationErrors['referenceDossierRaccordement'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['referenceDossierRaccordement']}
          nativeInputProps={{
            type: 'text',
            name: 'referenceDossierRaccordement',
            placeholder: aideSaisieRéférenceDossierRaccordement?.format
              ? `Exemple: ${aideSaisieRéférenceDossierRaccordement?.format}`
              : `Renseigner l'identifiant`,
            required: true,
            defaultValue: référence.value ?? '',
            pattern:
              aideSaisieRéférenceDossierRaccordement &&
              !Option.isNone(aideSaisieRéférenceDossierRaccordement.expressionReguliere)
                ? aideSaisieRéférenceDossierRaccordement.expressionReguliere.expression
                : undefined,
          }}
        />
      ) : (
        <>
          <input name="referenceDossierRaccordement" type="hidden" value={référence.value} />
          <div>
            Référence du dossier de raccordement du projet : <strong>{référence.value}</strong>
          </div>
        </>
      )}

      <UploadNewOrModifyExistingDocument
        label="Accusé de réception de la demande complète de raccordement **"
        name="accuseReception"
        required
        formats={['pdf']}
        state={validationErrors['accuseReception'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['accuseReception']}
        documentKeys={accuséRéception ? [accuséRéception] : undefined}
      />

      <InputDate
        id="dateQualification"
        state={validationErrors['dateQualification'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateQualification']}
        label="Date de l'accusé de réception"
        name="dateQualification"
        max={now()}
        defaultValue={dateQualification}
        required
        small
      />
    </Form>
  );
};
