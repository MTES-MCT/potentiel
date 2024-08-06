import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1 } from '@/components/atoms/headings';

import { ImporterCandidaturesForm, ImporterCandidaturesFormProps } from './ImportCandidatures.form';

export type CandidaturesImportPageProps = PlainType<ImporterCandidaturesFormProps>;

export const CandidaturesImportPage: FC<CandidaturesImportPageProps> = ({ appelOffres }) => (
  <ColumnPageTemplate
    banner={<Heading1 className="text-theme-white">Importer des candidats</Heading1>}
    leftColumn={{
      children: <ImporterCandidaturesForm appelOffres={appelOffres} />,
    }}
    rightColumn={{
      children: (
        <></>
        // <Alert
        //   severity="info"
        //   small
        //   description={
        //     <div className="py-4 text-justify">
        //       <Table
        //         className="lg:mx-4 my-4 border-spacing-0"
        //         caption="Résumé du tableau attendu pour l'import des dates de mise en service"
        //         headers={['Colonne', 'Format']}
        //         data={[
        //           ['referenceDossier', 'chaîne de caractères'],
        //           ['dateMiseEnService', 'date au format JJ/MM/AAAA'],
        //         ]}
        //       />
        //     </div>
        //   }
        // />
      ),
    }}
  />
);
