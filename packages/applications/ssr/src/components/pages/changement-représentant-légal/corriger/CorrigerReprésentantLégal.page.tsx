import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  CorrigerReprésentantLégalForm,
  CorrigerReprésentantLégalFormProps,
} from './CorrigerReprésentantLégal.form';

export type CorrigerReprésentantLégalPageProps = CorrigerReprésentantLégalFormProps;

export const CorrigerReprésentantLégalPage: FC<CorrigerReprésentantLégalPageProps> = ({
  identifiantProjet,
  représentantLégalExistant,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <Heading1>Corriger le représentant légal</Heading1>
    <CorrigerReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      représentantLégalExistant={représentantLégalExistant}
    />
  </PageTemplate>
);
