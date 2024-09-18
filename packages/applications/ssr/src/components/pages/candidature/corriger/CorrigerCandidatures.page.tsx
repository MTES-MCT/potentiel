import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { CorrigerCandidaturesForm } from './CorrigerCandidatures.form';

export const CorrigerCandidaturesPage: FC = () => (
  <ColumnPageTemplate
    banner={<Heading1 className="text-theme-white">Corriger des candidats</Heading1>}
    leftColumn={{
      children: (
        <>
          <CorrigerCandidaturesForm />
          <div className="mt-4">
            <Link href={Routes.Candidature.lister()}>Voir tous les candidats</Link>
          </div>
        </>
      ),
    }}
    rightColumn={{
      children: (
        <Alert
          severity="info"
          small
          description={
            <div className="py-4 text-justify">
              Aucune notification ne sera envoyée suite à cet import.
            </div>
          }
        />
      ),
    }}
  />
);
