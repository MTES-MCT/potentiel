'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  transmettrePropositionTechniqueEtFinancièreAction,
  TransmettrePropositionTechniqueEtFinancièreFormKeys,
} from './transmettrePropositionTechniqueEtFinancière.action';

export type TransmettrePropositionTechniqueEtFinancièreFormProps = {
  identifiantProjet: string;
  referenceDossierRaccordement: string;
};

export const TransmettrePropositionTechniqueEtFinancièreForm: FC<
  TransmettrePropositionTechniqueEtFinancièreFormProps
> = ({ identifiantProjet, referenceDossierRaccordement }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettrePropositionTechniqueEtFinancièreFormKeys>
  >({});

  return (
    <Form
      heading="Transmettre la proposition technique et financière"
      action={transmettrePropositionTechniqueEtFinancièreAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Transmettre',
        secondaryAction: {
          type: 'back',
          href: Routes.Raccordement.détail(identifiantProjet),
          label: 'Retour aux dossiers de raccordement',
        },
      }}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossier" value={referenceDossierRaccordement} />

      <Input
        label="Date de signature"
        state={validationErrors['dateSignature'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateSignature']}
        nativeInputProps={{
          type: 'date',
          name: 'dateSignature',
          max: new Date().toISOString().split('T').shift(),
          required: true,
          'aria-required': true,
        }}
      />

      <UploadNewOrModifyExistingDocument
        label="Proposition technique et financière signée"
        name="propositionTechniqueEtFinanciereSignee"
        required
        formats={['pdf']}
        state={validationErrors['propositionTechniqueEtFinanciereSignee'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['propositionTechniqueEtFinanciereSignee']}
      />
    </Form>
  );
};
