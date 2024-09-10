import { FC } from 'react';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { ImporterCandidaturesForm } from './ImporterCandidatures.form';

export const ImporterCandidaturesPage: FC = () => (
  <PageTemplate banner={<Heading1 className="text-theme-white">Importer des candidats</Heading1>}>
    <ImporterCandidaturesForm />
    <div className="mt-4">
      <Link href={Routes.Candidature.lister()}>Voir tous les candidats</Link>
    </div>
  </PageTemplate>
);
