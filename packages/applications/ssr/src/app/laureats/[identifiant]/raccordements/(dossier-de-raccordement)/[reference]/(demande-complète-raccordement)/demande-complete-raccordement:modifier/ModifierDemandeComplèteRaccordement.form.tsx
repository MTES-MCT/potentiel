'use client';

import { FC, useState } from 'react';
import Link from 'next/link';

import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';
import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { InputDate } from '@/components/atoms/form/InputDate';
import { ValidationErrors } from '@/utils/formAction';

import { Icon } from '../../../../../../../../components/atoms/Icon';

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

      <div className="flex flex-col gap-2 mb-4">
        <div>
          Gestionnaire réseau :{' '}
          <strong>
            {gestionnaireRéseauActuel.raisonSociale} (
            {gestionnaireRéseauActuel.identifiantGestionnaireRéseau})
          </strong>
        </div>

        <div className="flex gap-2">
          <div>
            Référence du dossier de raccordement du projet : <strong>{référence.value}</strong>
          </div>
          {référence.canEdit && (
            <Link
              className="ml-1"
              href={Routes.Raccordement.corrigerRéférenceDossier(
                identifiantProjet,
                référence.value,
              )}
              aria-label={`Modifier la référence actuelle (${référence.value})`}
            >
              <Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
              Modifier
            </Link>
          )}
          <input name="referenceDossierRaccordement" type="hidden" value={référence.value} />
        </div>
      </div>

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
