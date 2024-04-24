'use client';

import React, { FC, useState } from 'react';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Input from '@codegouvfr/react-dsfr/Input';
import { useRouter } from 'next/navigation';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

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
            buttons={
              <>
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
              </>
            }
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
              hint="Format accepté : pdf"
              nativeInputProps={{
                name: 'propositionTechniqueEtFinanciereSignee',
                required: true,
                accept: '.pdf',
                'aria-required': true,
              }}
              state={
                validationErrors.includes('propositionTechniqueEtFinanciereSignee')
                  ? 'error'
                  : 'default'
              }
              stateRelatedMessage="Accusé de réception de la proposition technique et finançière obligatoire"
            />
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
