import React, { FC } from 'react';
import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import { Form } from '@/components/atoms/form/Form';
import Link from 'next/link';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputFile } from '@/components/atoms/form/InputFile';
import { formatDateForInput } from '@/utils/formatDateForInput';
import Input from '@codegouvfr/react-dsfr/Input';
import { Routes } from '@potentiel-libraries/routes';
import { modifierPropositionTechniqueEtFinancièreAction } from './modifierPropositionTechniqueEtFinancière.action';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

type ModifierPropositionTechniqueEtFinancièrePageProps = {
  projet: ProjetBannerProps;
  raccordement: {
    référence: string;
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
    référence,
    propositionTechniqueEtFinancière: { dateSignature, propositionTechniqueEtFinancièreSignée },
  },
}: ModifierPropositionTechniqueEtFinancièrePageProps) => {
  const { identifiantProjet } = projet;

  return (
    <PageTemplate
      type="projet"
      projet={projet}
      heading={<TitrePageRaccordement />}
      form={
        <Form
          method="POST"
          encType="multipart/form-data"
          action={modifierPropositionTechniqueEtFinancièreAction}
          heading="Modifier la proposition technique et financière"
        >
          <p className="my-2 p-0">Référence du dossier de raccordement : {référence}</p>

          <InputFile
            id="file"
            label="Proposition technique et financière signée"
            name="file"
            fileUrl={Routes.Document.télécharger(propositionTechniqueEtFinancièreSignée)}
          />

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

          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <SubmitButton>Modifier</SubmitButton>
            <Link href={Routes.Raccordement.détail(identifiantProjet)} className="m-auto">
              Retour vers le dossier de raccordement
            </Link>
          </div>
        </Form>
      }
      information={{
        description:
          'Le dépôt est informatif, il ne remplace pas la transmission à votre gestionnaire.',
        title: 'Concernant le dépôt',
      }}
    />
  );
};
