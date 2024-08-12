import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { ImporterCandidaturesForm } from './ImporterCandidatures.form';

export const ImporterCandidaturesPage: FC = () => (
  <PageTemplate banner={<Heading1 className="text-theme-white">Importer des candidats</Heading1>}>
    <ImporterCandidaturesForm />
  </PageTemplate>
);
