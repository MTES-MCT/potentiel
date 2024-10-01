'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  modifierPropositionTechniqueEtFinancièreAction,
  ModifierPropositionTechniqueEtFinancièreFormKeys,
} from './modifierPropositionTechniqueEtFinancière.action';

export type ModifierPropositionTechniqueEtFinancièreFormProps = {
  identifiantProjet: string;
  raccordement: {
    reference: string;
    propositionTechniqueEtFinancière: {
      dateSignature: Iso8601DateTime;
      propositionTechniqueEtFinancièreSignée: string;
    };
  };
};

export const ModifierPropositionTechniqueEtFinancièreForm: FC<
  ModifierPropositionTechniqueEtFinancièreFormProps
> = ({
  identifiantProjet,
  raccordement: {
    reference,
    propositionTechniqueEtFinancière: { dateSignature, propositionTechniqueEtFinancièreSignée },
  },
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierPropositionTechniqueEtFinancièreFormKeys>
  >({});

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={modifierPropositionTechniqueEtFinancièreAction}
      heading="Modifier la proposition technique et financière"
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
      <div>
        Référence du dossier de raccordement : <strong>{reference}</strong>
      </div>

      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossierRaccordement" value={reference} />

      <InputDate
        id="dateSignature"
        label="Date de signature"
        nativeInputProps={{
          type: 'date',
          name: 'dateSignature',
          max: now(),
          defaultValue: dateSignature,
          required: true,
        }}
        state={validationErrors['dateSignature'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateSignature']}
      />

      <UploadDocument
        label="Proposition technique et financière signée"
        name="propositionTechniqueEtFinanciereSignee"
        required
        state={validationErrors['propositionTechniqueEtFinanciereSignee'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['propositionTechniqueEtFinanciereSignee']}
        documentKey={propositionTechniqueEtFinancièreSignée}
      />
    </Form>
  );
};
