import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { DemanderDélaiForm, DemanderDélaiFormProps } from './DemanderDélai.form';

export type DemanderDélaiPageProps = DemanderDélaiFormProps;

export const DemanderDélaiPage: FC<DemanderDélaiPageProps> = ({
  identifiantProjet,
  dateAchèvementPrévisionnelleActuelle,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />} feature="délai">
    <Heading1>Demander un délai pour le projet</Heading1>
    <DemanderDélaiForm
      identifiantProjet={identifiantProjet}
      dateAchèvementPrévisionnelleActuelle={dateAchèvementPrévisionnelleActuelle}
    />
  </PageTemplate>
);
