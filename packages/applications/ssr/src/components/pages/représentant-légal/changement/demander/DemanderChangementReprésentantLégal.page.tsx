import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  DemanderChangementReprésentantLégalForm,
  DemanderChangementReprésentantLégalFormProps,
} from './DemanderChangementReprésentantLégal.form';

export type DemanderChangementReprésentantLégalPageProps =
  DemanderChangementReprésentantLégalFormProps;

export const DemanderChangementReprésentantLégalPage: FC<
  DemanderChangementReprésentantLégalPageProps
> = ({ identifiantProjet }) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <Heading1>Demander un changement de représentant légal</Heading1>
    <DemanderChangementReprésentantLégalForm identifiantProjet={identifiantProjet} />
  </PageTemplate>
);
