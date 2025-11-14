import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  ModifierDispositifDeStockageForm,
  ModifierDispositifDeStockageFormProps,
} from './ModifierDispositifDeStockage.form';

export type ModifierDispositifDeStockagePageProps = ModifierDispositifDeStockageFormProps;

export const ModifierDispositifDeStockagePage: FC<ModifierDispositifDeStockagePageProps> = ({
  identifiantProjet,
  dispositifDeStockage,
}) => (
  <>
    <Heading1>Changer le dispositif de stockage</Heading1>
    <ModifierDispositifDeStockageForm
      identifiantProjet={identifiantProjet}
      dispositifDeStockage={dispositifDeStockage}
    />
  </>
);
