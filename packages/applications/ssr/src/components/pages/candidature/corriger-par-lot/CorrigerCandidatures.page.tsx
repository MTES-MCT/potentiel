import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { CorrigerCandidaturesForm } from './CorrigerCandidatures.form';

export const CorrigerCandidaturesPage: FC = () => (
  <ColumnPageTemplate
    banner={<Heading1 className="text-theme-white">Corriger des candidats par lot</Heading1>}
    leftColumn={{
      children: <CorrigerCandidaturesForm />,
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
                  Si les candidatures que vous modifiez sont déjà notifiées, alors la modification
                  des champs suivants ne mettra pas à jour le projet :
                  <ul className="p-4 list-disc">
                    <li>Nom du projet</li>
                    <li>Localité (adresse, commune, code postal, département, région)</li>
                    <li>Actionnaire (société mère)</li>
                    <li>Nom du représentant légal</li>
                    <li>Puissance</li>
                  </ul>
                </span>
                <span>
                  Pour les modifier <b>après notification</b>, utilisez le formulaire de
                  modification disponible sur chaque page Projet.
                </span>
              </div>
            }
          />
        </>
      ),
    }}
  />
);
