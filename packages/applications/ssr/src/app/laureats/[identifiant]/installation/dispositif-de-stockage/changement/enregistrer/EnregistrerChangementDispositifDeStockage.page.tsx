import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Heading1 } from '@/components/atoms/headings';

import { EnregistrerChangementDispositifDeStockageForm } from './EnregistrerChangementDispositifDeStockage.form';

export type EnregistrerChangementDispositifDeStockagePageProps =
  PlainType<Lauréat.Installation.ConsulterDispositifDeStockageReadModel>;

export const EnregistrerChangementDispositifDeStockagePage: FC<
  EnregistrerChangementDispositifDeStockagePageProps
> = ({ identifiantProjet, dispositifDeStockage }) => (
  <>
    <Heading1>Changer le dispositif de stockage</Heading1>
    <EnregistrerChangementDispositifDeStockageForm
      identifiantProjet={identifiantProjet}
      dispositifDeStockage={dispositifDeStockage}
    />
  </>
);
