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
        <Alert
          severity="info"
          small
          description={
            <div className="flex flex-col gap-2 text-justify">
              <span>Aucune notification ne sera envoyée suite à cet import</span>
              <span>
                Il est possible de corriger les données candidature par candidature et de régénérer
                une attestation post-désignation en consultant{' '}
                <Link href={Routes.Candidature.lister()} target="_blank">
                  la liste des candidatures
                </Link>{' '}
                ou la page du projet concerné.
              </span>
            </div>
          }
        />
      ),
    }}
  />
);
