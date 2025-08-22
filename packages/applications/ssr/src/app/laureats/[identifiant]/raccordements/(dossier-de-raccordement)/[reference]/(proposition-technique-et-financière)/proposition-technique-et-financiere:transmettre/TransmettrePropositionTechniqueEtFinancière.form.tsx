'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import { type FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import type { ValidationErrors } from '@/utils/formAction';
import {
  type TransmettrePropositionTechniqueEtFinancièreFormKeys,
  transmettrePropositionTechniqueEtFinancièreAction,
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
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossier" value={referenceDossierRaccordement} />

      <Input
        label="Date de signature"
        state={validationErrors.dateSignature ? 'error' : 'default'}
        stateRelatedMessage={validationErrors.dateSignature}
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
        state={validationErrors.propositionTechniqueEtFinanciereSignee ? 'error' : 'default'}
        stateRelatedMessage={validationErrors.propositionTechniqueEtFinanciereSignee}
      />
    </Form>
  );
};
