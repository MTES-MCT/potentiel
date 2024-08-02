'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { modifierPropositionTechniqueEtFinancièreAction } from './modifierPropositionTechniqueEtFinancière.action';

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
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={modifierPropositionTechniqueEtFinancièreAction}
      onSuccess={() => router.push(Routes.Raccordement.détail(identifiantProjet))}
      heading="Modifier la proposition technique et financière"
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
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
      />

      <UploadDocument
        label="Proposition technique et financière signée"
        name="propositionTechniqueEtFinanciereSignee"
        required
        state={
          validationErrors.includes('propositionTechniqueEtFinanciereSignee') ? 'error' : 'default'
        }
        documentKey={propositionTechniqueEtFinancièreSignée}
      />

      <div className="flex flex-col md:flex-row gap-4 m-auto">
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
      </div>
    </Form>
  );
};
