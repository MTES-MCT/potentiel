import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  NotifierCandidaturesForm,
  NotifierCandidaturesFormProps,
} from './NotifierCandidatures.form';

export type NotifierCandidaturesPageProps = PlainType<NotifierCandidaturesFormProps>;

export const NotifierCandidaturesPage: FC<NotifierCandidaturesFormProps> = ({ appelOffres }) => (
  <PageTemplate banner={<Heading1 className="text-theme-white">Notifier des candidats</Heading1>}>
    <NotifierCandidaturesForm appelOffres={appelOffres} />
  </PageTemplate>
);
