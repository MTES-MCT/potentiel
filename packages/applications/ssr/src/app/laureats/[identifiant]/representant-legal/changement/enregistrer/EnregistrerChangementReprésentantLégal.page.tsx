import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  EnregistrerChangementReprésentantLégalForm,
  EnregistrerChangementReprésentantLégalFormProps,
} from './EnregistrerChangementReprésentantLégal.form';

export type EnregistrerChangementReprésentantLégalPageProps =
  EnregistrerChangementReprésentantLégalFormProps;

export const EnregistrerChangementReprésentantLégalPage: FC<
  EnregistrerChangementReprésentantLégalPageProps
> = ({ identifiantProjet }) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <Heading1>Déclarer un changement de représentant légal</Heading1>
    <EnregistrerChangementReprésentantLégalForm identifiantProjet={identifiantProjet} />
  </PageTemplate>
);
