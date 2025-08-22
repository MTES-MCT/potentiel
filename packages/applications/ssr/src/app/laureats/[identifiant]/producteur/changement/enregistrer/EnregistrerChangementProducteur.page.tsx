import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { EnregistrerChangementProducteurForm } from './EnregistrerChangementProducteur.form';
import { InfoBoxAprèsAchèvement, InfoBoxRévocationDesDroits } from './InfoBoxProducteur';

export type EnregistrerChangementProducteurPageProps =
  PlainType<Lauréat.Producteur.ConsulterProducteurReadModel>;

export const EnregistrerChangementProducteurPage: FC<EnregistrerChangementProducteurPageProps> = ({
  identifiantProjet,
  producteur,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Changer de producteur</Heading1>
    <InfoBoxRévocationDesDroits />
    <InfoBoxAprèsAchèvement />
    <EnregistrerChangementProducteurForm
      identifiantProjet={identifiantProjet}
      producteur={producteur}
    />
  </PageTemplate>
);
