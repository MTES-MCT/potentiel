import { FC } from 'react';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { DemanderOuEnregistrerChangementReprésentantLégalForm } from '../components/DemanderOuEnregistrerChangementReprésentantLégal.form';

export type DemanderChangementReprésentantLégalPageProps = {
  identifiantProjet: string;
};

export const DemanderChangementReprésentantLégalPage: FC<
  DemanderChangementReprésentantLégalPageProps
> = ({ identifiantProjet }) => (
  <PageTemplate banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}>
    <Heading1>Demander un changement de représentant légal</Heading1>
    <DemanderOuEnregistrerChangementReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      estUneDemande={true}
    />
  </PageTemplate>
);
