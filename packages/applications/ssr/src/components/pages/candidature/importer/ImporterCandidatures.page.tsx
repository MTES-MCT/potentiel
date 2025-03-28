import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { ImporterCandidaturesForm } from './ImporterCandidatures.form';

export const ImporterCandidaturesPage: FC = () => (
  <ColumnPageTemplate
    banner={<Heading1 className="text-theme-white">Importer des candidats</Heading1>}
    leftColumn={{ children: <ImporterCandidaturesForm /> }}
    rightColumn={{
      className: 'mt-20',
      children: (
        <Alert
          severity="info"
          small
          description={
            <div className="py-4 text-justify">
              Il est possible de corriger des candidat existants:
              <ul className="list-disc px-4">
                <li>
                  au cas par cas, via la{' '}
                  <Link href={Routes.Candidature.lister()}>page des candidatures</Link>
                </li>
                <li>
                  par lot (CSV), via la{' '}
                  <Link href={Routes.Candidature.corrigerParLot}>page de correction</Link>
                </li>
              </ul>
            </div>
          }
        />
      ),
    }}
  />
);
