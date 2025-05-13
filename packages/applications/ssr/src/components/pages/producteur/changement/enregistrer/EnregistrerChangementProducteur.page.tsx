import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
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
