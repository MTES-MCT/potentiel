'use client';

import React, { FC, useState } from 'react';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import { modifierPropositionTechniqueEtFinancièreAction } from './modifierPropositionTechniqueEtFinancière.action';

export type ModifierPropositionTechniqueEtFinancièrePageProps = {
  identifiantProjet: string;
  raccordement: {
    reference: string;
    propositionTechniqueEtFinancière: {
      dateSignature: Iso8601DateTime;
      propositionTechniqueEtFinancièreSignée: string;
    };
  };
};

export const ModifierPropositionTechniqueEtFinancièrePage: FC<
  ModifierPropositionTechniqueEtFinancièrePageProps
> = ({
  identifiantProjet,
  raccordement: {
    reference,
    propositionTechniqueEtFinancière: { dateSignature, propositionTechniqueEtFinancièreSignée },
  },
}: ModifierPropositionTechniqueEtFinancièrePageProps) => {
  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<TitrePageRaccordement />}
      leftColumn={{
        children: (
          <Form
            method="POST"
            encType="multipart/form-data"
            action={modifierPropositionTechniqueEtFinancièreAction}
            onSuccess={() => router.push(Routes.Raccordement.détail(identifiantProjet))}
            heading="Modifier la proposition technique et financière"
            onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
          >
            <p className="my-2 p-0">Référence du dossier de raccordement : {reference}</p>

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
                validationErrors.includes('propositionTechniqueEtFinanciereSignee')
                  ? 'error'
                  : 'default'
              }
              documentKey={propositionTechniqueEtFinancièreSignée}
            />

            <div className="flex flex-col md:flex-row gap-4 m-auto">
              <Button
                priority="secondary"
                linkProps={{
                  href: Routes.Raccordement.détail(identifiantProjet),
                }}
                iconId="fr-icon-arrow-left-line"
              >
                Retour aux dossiers de raccordement
              </Button>
              <SubmitButton>Modifier</SubmitButton>
            </div>
          </Form>
        ),
      }}
      rightColumn={{
        children: (
          <Alert
            severity="info"
            small
            title="Concernant le dépôt"
            description={
              <div className="py-4 text-justify">
                Le dépôt est informatif, il ne remplace pas la transmission à votre gestionnaire.
              </div>
            }
          />
        ),
      }}
    />
  );
};
