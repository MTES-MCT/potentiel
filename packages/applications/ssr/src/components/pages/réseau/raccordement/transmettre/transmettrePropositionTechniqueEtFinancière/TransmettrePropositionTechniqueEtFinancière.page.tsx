'use client';

import React, { FC, useState } from 'react';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Input from '@codegouvfr/react-dsfr/Input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';

import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { Form } from '@/components/atoms/form/Form';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import { transmettrePropositionTechniqueEtFinancièreAction } from './transmettrePropositionTechniqueEtFinancière.action';

export type TransmettrePropositionTechniqueEtFinancièreProps = {
  projet: ProjetBannerProps;
  referenceDossierRaccordement: string;
};

export const TransmettrePropositionTechniqueEtFinancièrePage: FC<
  TransmettrePropositionTechniqueEtFinancièreProps
> = ({ projet, referenceDossierRaccordement }) => {
  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const { identifiantProjet } = projet;

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner {...projet} />}
      heading={<TitrePageRaccordement />}
      leftColumn={{
        children: (
          <Form
            method="POST"
            encType="multipart/form-data"
            heading="Transmettre la proposition technique et financière"
            action={transmettrePropositionTechniqueEtFinancièreAction}
            onSuccess={() => router.push(Routes.Raccordement.détail(projet.identifiantProjet))}
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

            <Upload
              label="Proposition technique et financière signée"
              hint="Vous pouvez transmettre un fichier compressé si il y a plusieurs documents"
              nativeInputProps={{
                name: 'propositionTechniqueEtFinanciereSignee',
                required: true,
                'aria-required': true,
              }}
              state={
                validationErrors.includes('propositionTechniqueEtFinanciereSignee')
                  ? 'error'
                  : 'default'
              }
              stateRelatedMessage="Erreur sur le fichier transmis"
            />

            <div className="flex flex-col md:flex-row gap-4 mt-5">
              <SubmitButton>Transmettre</SubmitButton>
              <Link href={Routes.Raccordement.détail(identifiantProjet)} className="m-auto">
                Retour au dossier de raccordement
              </Link>
            </div>
          </Form>
        ),
      }}
      rightColumn={{
        children: (
          <Alert
            severity="info"
            small
            description={
              <div className="py-4 text-justify">
                La proposition technique et financière transmise sur Potentiel facilitera vos
                démarches administratives avec le cocontractant connecté à Potentiel, notamment pour
                des retards de délai de raccordement.
                <br /> Le dépôt dans Potentiel est informatif, il ne remplace pas la transmission à
                votre gestionnaire de réseau.
              </div>
            }
          />
        ),
      }}
    />
  );
};
