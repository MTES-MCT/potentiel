'use client';

import React, { FC } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputFile } from '@/components/atoms/form/InputFile';
import { formatDateForInput } from '@/utils/formatDateForInput';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import { modifierPropositionTechniqueEtFinancièreAction } from './modifierPropositionTechniqueEtFinancière.action';

export type ModifierPropositionTechniqueEtFinancièrePageProps = {
  projet: ProjetBannerProps;
  raccordement: {
    reference: string;
    propositionTechniqueEtFinancière: {
      dateSignature: string;
      propositionTechniqueEtFinancièreSignée: string;
    };
  };
};

export const ModifierPropositionTechniqueEtFinancièrePage: FC<
  ModifierPropositionTechniqueEtFinancièrePageProps
> = ({
  projet,
  raccordement: {
    reference,
    propositionTechniqueEtFinancière: { dateSignature, propositionTechniqueEtFinancièreSignée },
  },
}: ModifierPropositionTechniqueEtFinancièrePageProps) => {
  const { identifiantProjet } = projet;
  const router = useRouter();

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner {...projet} />}
      heading={<TitrePageRaccordement />}
      leftColumn={{
        children: (
          <Form
            method="POST"
            encType="multipart/form-data"
            action={modifierPropositionTechniqueEtFinancièreAction}
            onSuccess={() => router.push(Routes.Raccordement.détail(projet.identifiantProjet))}
            heading="Modifier la proposition technique et financière"
          >
            <p className="my-2 p-0">Référence du dossier de raccordement : {reference}</p>

            <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
            <input type="hidden" name="referenceDossierRaccordement" value={reference} />

            <Input
              id="dateSignature"
              label="Date de signature"
              nativeInputProps={{
                type: 'date',
                name: 'dateSignature',
                defaultValue: formatDateForInput(dateSignature),
                max: new Date().toISOString().split('T').shift(),
                required: true,
              }}
            />

            <InputFile
              id="file"
              label="Proposition technique et financière signée"
              name="propositionTechniqueEtFinanciereSignee"
              fileUrl={Routes.Document.télécharger(propositionTechniqueEtFinancièreSignée)}
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
