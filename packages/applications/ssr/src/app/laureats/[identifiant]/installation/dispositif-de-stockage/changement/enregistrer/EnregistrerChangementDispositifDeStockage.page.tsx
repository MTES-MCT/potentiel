import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { EnregistrerChangementDispositifDeStockageForm } from './EnregistrerChangementDispositifDeStockage.form';

export type EnregistrerChangementDispositifDeStockagePageProps =
  PlainType<Lauréat.Installation.ConsulterDispositifDeStockageReadModel>;

export const EnregistrerChangementDispositifDeStockagePage: FC<
  EnregistrerChangementDispositifDeStockagePageProps
> = ({ identifiantProjet, dispositifDeStockage }) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <Heading1>Changer l'installateur</Heading1>
    <EnregistrerChangementDispositifDeStockageForm
      identifiantProjet={identifiantProjet}
      dispositifDeStockage={dispositifDeStockage}
    />
  </PageTemplate>
);
