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
    leftColumn={{ children: <CorrigerCandidaturesForm /> }}
    rightColumn={{
      children: (
        <Alert
          severity="info"
          small
          description={
            <div className="py-4 text-justify">
              Aucune notification se sera envoyée suite à cet import. <br />
              <br />
              Pour regénérerer les attestations pour des candidats déjà notifiés, rendez-vous sur la
              page{' '}
              <Link href={Routes.Candidature.regénérerAttestations}>
                Regénérer des attestations
              </Link>
            </div>
          }
        />
      ),
    }}
  />
);
