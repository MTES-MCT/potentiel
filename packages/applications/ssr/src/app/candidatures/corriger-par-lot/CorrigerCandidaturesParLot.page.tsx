import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { PageTemplate } from '@/components/templates/Page.template';

import { CorrigerCandidaturesParLotForm } from './CorrigerCandidaturesParLot.form';

export const CorrigerCandidaturesParLotPage: FC = () => (
  <PageTemplate banner={<Heading1>Corriger des candidats par lot</Heading1>}>
    <ColumnPageTemplate
      leftColumn={{
        children: <CorrigerCandidaturesParLotForm />,
      }}
      rightColumn={{
        children: (
          <>
            <Alert
              severity="info"
              small
              description={
                <div className="flex flex-col gap-2 text-justify">
                  <span>Aucune notification ne sera envoyée suite à cet import.</span>
                  <span>
                    Il est possible de corriger les données candidature par candidature et de
                    régénérer une attestation post-désignation en consultant{' '}
                    <Link href={Routes.Candidature.lister()} target="_blank">
                      la liste des candidatures
                    </Link>
                    .
                  </span>
                </div>
              }
            />
            <Alert
              severity="info"
              small
              description={
                <div className="flex flex-col gap-2 text-justify">
                  <span>
                    <b>Si les candidatures que vous modifiez sont notifiées</b>
                    <br />- La modification de ces champs ne mettra pas à jour le projet
                    <ul className="p-4 list-disc">
                      <li>Nom du projet</li>
                      <li>Localité (adresse, commune, code postal, département, région)</li>
                      <li>Actionnaire (société mère)</li>
                      <li>Nom du représentant légal</li>
                      <li>Puissance (la puissance initiale sera par contre modifiée)</li>
                      <li>Producteur</li>
                      <li>Fournisseurs</li>
                      <li>Évaluation carbone simplifiée</li>
                    </ul>
                    Pour les modifier, utilisez le formulaire disponible sur chaque page Projet.
                  </span>
                  <span>
                    <br />- Aussi, les données suivantes ne pourront pas être modifiées :
                    <ul className="p-4 list-disc">
                      <li>Statut</li>
                      <li>Garanties financières</li>
                    </ul>
                  </span>
                </div>
              }
            />
          </>
        ),
      }}
    />
  </PageTemplate>
);
