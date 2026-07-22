'use client';

import { type FC, useState } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import { RéférenceDossierInput } from '../../components/RéférenceDossierInput';
import {
  type CorrigerRéférenceDossierFormKeys,
  corrigerRéférenceDossierAction,
} from './corrigerRéférenceDossierRaccordement.action';

export type CorrigerRéférenceDossierFormProps = {
  identifiantProjet: string;
  dossierRaccordement: PlainType<Lauréat.Raccordement.ConsulterDossierRaccordementReadModel>;
  gestionnaireRéseau: PlainType<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel>;
};

export const CorrigerRéférenceDossierForm: FC<CorrigerRéférenceDossierFormProps> = ({
  identifiantProjet,
  dossierRaccordement: { référence },
  gestionnaireRéseau,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerRéférenceDossierFormKeys>
  >({});

  return (
    <Form
      action={corrigerRéférenceDossierAction}
      heading="Corriger une référence de dossier de raccordement"
      pendingModal={{
        id: 'form-corriger-reference-dossier',
        title: 'Correction en cours',
        children: 'Correction de la référence de dossier de raccordement en cours',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Corriger',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossier" value={référence.référence} />
      <RéférenceDossierInput
        aideSaisie={gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement}
        defaultValue={référence.référence ?? ''}
        validationErrors={validationErrors}
        name="referenceDossierCorrigee"
      />
    </Form>
  );
};
