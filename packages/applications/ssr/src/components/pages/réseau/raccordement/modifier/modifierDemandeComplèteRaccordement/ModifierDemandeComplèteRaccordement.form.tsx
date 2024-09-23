'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { InputDate } from '@/components/atoms/form/InputDate';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { modifierDemandeComplèteRaccordementAction } from './modifierDemandeComplèteRaccordement.action';

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
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const { aideSaisieRéférenceDossierRaccordement, identifiantGestionnaireRéseau } =
    gestionnaireRéseauActuel;

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={modifierDemandeComplèteRaccordementAction}
      heading="Modifier une demande complète de raccordement"
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
          <SubmitButton>Modifier</SubmitButton>
        </>
      }
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />
      <input name="referenceDossierRaccordementActuelle" type="hidden" value={référence.value} />
      <input
        name="identifiantGestionnaireReseau"
        type="hidden"
        value={identifiantGestionnaireRéseau}
      />

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
          state={validationErrors.includes('referenceDossierRaccordement') ? 'error' : 'default'}
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

      <UploadDocument
        label="Accusé de réception de la demande complète de raccordement **"
        name="accuseReception"
        required
        state={validationErrors.includes('accuseReception') ? 'error' : 'default'}
        documentKey={accuséRéception}
      />

      <InputDate
        id="dateQualification"
        state={validationErrors.includes('dateQualification') ? 'error' : 'default'}
        label="Date de l'accusé de réception"
        nativeInputProps={{
          type: 'date',
          name: 'dateQualification',
          max: now(),
          defaultValue: dateQualification,
          required: true,
        }}
      />
    </Form>
  );
};
