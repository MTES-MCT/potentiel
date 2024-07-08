'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { transmettrePropositionTechniqueEtFinancièreAction } from './transmettrePropositionTechniqueEtFinancière.action';
import { TransmettrePropositionTechniqueEtFinancièrePageProps } from './TransmettrePropositionTechniqueEtFinancière.page';

type TransmettrePropositionTechniqueEtFinancièreFormProps =
  TransmettrePropositionTechniqueEtFinancièrePageProps;

export const TransmettrePropositionTechniqueEtFinancièreForm: FC<
  TransmettrePropositionTechniqueEtFinancièreFormProps
> = ({ identifiantProjet, referenceDossierRaccordement }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      heading="Transmettre la proposition technique et financière"
      action={transmettrePropositionTechniqueEtFinancièreAction}
      onSuccess={() => router.push(Routes.Raccordement.détail(identifiantProjet))}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossier" value={referenceDossierRaccordement} />

      <Input
        label="Date de signature"
        state={validationErrors.includes('dateSignature') ? 'error' : 'default'}
        nativeInputProps={{
          type: 'date',
          name: 'dateSignature',
          max: new Date().toISOString().split('T').shift(),
          required: true,
          'aria-required': true,
        }}
      />

      <UploadDocument
        label="Proposition technique et financière signée"
        name="propositionTechniqueEtFinanciereSignee"
        required
        state={
          validationErrors.includes('propositionTechniqueEtFinanciereSignee') ? 'error' : 'default'
        }
      />

      <div className="flex flex-col md:flex-row gap-4 mt-5">
        <Button
          priority="secondary"
          linkProps={{
            href: Routes.Raccordement.détail(identifiantProjet),
          }}
          iconId="fr-icon-arrow-left-line"
        >
          Retour aux dossiers de raccordement
        </Button>
        <SubmitButton>Transmettre</SubmitButton>
      </div>
    </Form>
  );
};
