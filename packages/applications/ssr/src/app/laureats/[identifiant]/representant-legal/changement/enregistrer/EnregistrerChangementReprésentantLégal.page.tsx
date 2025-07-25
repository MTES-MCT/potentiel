import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { DemanderOuEnregistrerChangementReprésentantLégalForm } from '../components/DemanderOuEnregistrerChangementReprésentantLégal.form';

export type EnregistrerChangementReprésentantLégalPageProps = {
  identifiantProjet: string;
};

export const EnregistrerChangementReprésentantLégalPage: FC<
  EnregistrerChangementReprésentantLégalPageProps
> = ({ identifiantProjet }) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <Heading1>Déclarer un changement de représentant légal</Heading1>
    <DemanderOuEnregistrerChangementReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      estUneDemande={false}
    />
  </PageTemplate>
);
