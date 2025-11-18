import { FC } from 'react';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';

import { DétailsDispositifDeStockage } from '../../DétailsDispositifDeStockage';

import { DétailsChangementDispositifDeStockagePageProps } from './DétailsChangementDispositifDeStockage.page';

export type DétailsChangementDispositifDeStockageProps = {
  changement: DétailsChangementDispositifDeStockagePageProps['changement'];
};

export const DétailsChangementDispositifDeStockage: FC<
  DétailsChangementDispositifDeStockageProps
> = ({ changement }) => {
  return (
    <DétailsChangement
      title="Changement de dispositif de stockage"
      changement={changement}
      valeurs={
        <DétailsDispositifDeStockage dispositifDeStockage={changement.dispositifDeStockage} />
      }
      statut="information-enregistrée"
    />
  );
};
