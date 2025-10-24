import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { ImporterCandidaturesParCSVForm } from './(csv)/ImporterCandidaturesParCSV.form';
type ImporterCandidaturesPageProps = {
  périodes: PlainType<Période.ListerPériodeItemReadModel[]>;
};

export const ImporterCandidaturesPage: FC<ImporterCandidaturesPageProps> = ({ périodes }) => (
  <ColumnPageTemplate
    banner={<Heading1 className="text-theme-white">Importer des candidats</Heading1>}
    leftColumn={{ children: <ImporterCandidaturesParCSVForm /> }}
    rightColumn={{
      className: 'mt-20',
      children: (
        <div className="flex flex-col gap-2">
          <Alert
            severity="info"
            small
            description={
              <div className="py-4 ">
                Pour importer des candidatures depuis Démarches Simplifiée, c'est{' '}
                <Link href={Routes.Candidature.importerDS}>ici</Link>.
              </div>
            }
          />
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
        </div>
      ),
    }}
  />
);
