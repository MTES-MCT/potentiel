'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { InputDate } from '@/components/atoms/form/InputDate';
import { ValidationErrors } from '@/utils/formAction';

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
  gestionnaireRéseauActuel: {
    identifiantGestionnaireRéseau: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement?: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  };
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
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierDemandeComplèteRaccordementFormKeys>
  >({});

  const { aideSaisieRéférenceDossierRaccordement } = gestionnaireRéseauActuel;

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
        <strong>
          {gestionnaireRéseauActuel.raisonSociale} (
          {gestionnaireRéseauActuel.identifiantGestionnaireRéseau})
        </strong>
      </div>

      {référence.canEdit ? (
        <Input
          id="referenceDossierRaccordement"
          label="Référence du dossier de raccordement du projet *"
          hintText={
            aideSaisieRéférenceDossierRaccordement && (
              <>
                {aideSaisieRéférenceDossierRaccordement.format !== '' && (
                  <div className="m-0">
                    Format attendu : {aideSaisieRéférenceDossierRaccordement.format}
                  </div>
                )}
                {aideSaisieRéférenceDossierRaccordement.légende !== '' && (
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
            pattern: aideSaisieRéférenceDossierRaccordement?.expressionReguliere || undefined,
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
      />
    </Form>
  );
};
