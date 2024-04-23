'use client';

import React, { FC, useState } from 'react';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Iso8601DateTime, now } from '@/utils/formatDate';
import { InputDate } from '@/components/atoms/form/InputDate';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import { modifierPropositionTechniqueEtFinancièreAction } from './modifierPropositionTechniqueEtFinancière.action';

export type ModifierPropositionTechniqueEtFinancièrePageProps = {
  projet: ProjetBannerProps;
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
  projet,
  raccordement: {
    reference,
    propositionTechniqueEtFinancière: { dateSignature, propositionTechniqueEtFinancièreSignée },
  },
}: ModifierPropositionTechniqueEtFinancièrePageProps) => {
  const { identifiantProjet } = projet;
  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

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

            <Upload
              label={
                <>
                  Proposition technique et finançière signée{' '}
                  {propositionTechniqueEtFinancièreSignée && (
                    <>
                      <br />
                      <small>
                        Pour que la modification puisse fonctionner, merci de joindre un nouveau
                        fichier ou{' '}
                        <Link
                          href={Routes.Document.télécharger(propositionTechniqueEtFinancièreSignée)}
                          target="_blank"
                        >
                          celui préalablement transmis
                        </Link>
                      </small>
                    </>
                  )}
                </>
              }
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
