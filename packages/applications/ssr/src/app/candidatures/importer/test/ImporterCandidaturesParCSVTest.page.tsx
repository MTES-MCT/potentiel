import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { ImporterCandidaturesParCSVTestForm } from './ImporterCandidaturesParCSVTest.form';

export const ImporterCandImporterCandidaturesParCSVTestPage: FC = () => (
  <PageTemplate
    banner={<Heading1 className="text-theme-white">Importer des candidats (test)</Heading1>}
  >
    <Alert
      severity="info"
      small
      className="mb-4"
      description={
        <>
          Cette page est destinée aux{' '}
          <span className="font-semibold">environnements de test uniquement</span>. <br />
          Elle permet de faire des imports de candidatures par CSV, sans demander au préalable de
          sélectionner un appel d'offres et une période
        </>
      }
    />
    <ImporterCandidaturesParCSVTestForm />
  </PageTemplate>
);
