import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  EnregistrerChangementDispositifDeStockageForm,
  EnregistrerChangementDispositifDeStockageFormProps,
} from './EnregistrerChangementDispositifDeStockage.form';

type EnregistrerChangementDispositifDeStockagePageProps =
  EnregistrerChangementDispositifDeStockageFormProps;

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
