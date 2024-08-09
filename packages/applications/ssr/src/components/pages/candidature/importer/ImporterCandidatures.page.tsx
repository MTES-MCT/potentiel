import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  ImporterCandidaturesForm,
  ImporterCandidaturesFormProps,
} from './ImporterCandidatures.form';

export type ImporterCandidaturesPageProps = PlainType<ImporterCandidaturesFormProps>;

export const ImporterCandidaturesPage: FC<ImporterCandidaturesPageProps> = ({ appelOffres }) => (
  <PageTemplate banner={<Heading1 className="text-theme-white">Importer des candidats</Heading1>}>
    <ImporterCandidaturesForm appelOffres={appelOffres} />
  </PageTemplate>
);
