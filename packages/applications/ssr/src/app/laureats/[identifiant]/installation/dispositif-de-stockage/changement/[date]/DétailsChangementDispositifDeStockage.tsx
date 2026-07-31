import type { FC } from 'react';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';
import { DétailsDispositifDeStockage } from '../../DétailsDispositifDeStockage';
import type { DétailsChangementDispositifDeStockagePageProps } from './DétailsChangementDispositifDeStockage.page';

export type DétailsChangementDispositifDeStockageProps = {
  changement: DétailsChangementDispositifDeStockagePageProps['changement'];
};

export const DétailsChangementDispositifDeStockage: FC<
  DétailsChangementDispositifDeStockageProps
> = ({ changement }) => {
  return (
    <DétailsChangement
      changement={changement}
      valeurs={
        <DétailsDispositifDeStockage dispositifDeStockage={changement.dispositifDeStockage} />
      }
      statut="information-enregistrée"
    />
  );
};
