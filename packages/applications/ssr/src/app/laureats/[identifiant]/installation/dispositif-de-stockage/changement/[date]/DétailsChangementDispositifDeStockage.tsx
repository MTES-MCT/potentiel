import { FC } from 'react';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';

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
        <div>
          Dispositif de stockage :{' '}
          <span className="font-semibold">
            {changement.dispositifDeStockage.installationAvecDispositifDeStockage ? 'avec' : 'sans'}
          </span>
          {changement.dispositifDeStockage.puissanceDuDispositifDeStockageEnKW !== undefined ? (
            <div>
              Puissance du dispositif de stockage :{' '}
              {changement.dispositifDeStockage.puissanceDuDispositifDeStockageEnKW} kW
            </div>
          ) : null}
          {changement.dispositifDeStockage.capacitéDuDispositifDeStockageEnKWh !== undefined ? (
            <div>
              Capacité du dispositif de stockage :{' '}
              {changement.dispositifDeStockage.capacitéDuDispositifDeStockageEnKWh} kWh
            </div>
          ) : null}
        </div>
      }
      statut="information-enregistrée"
    />
  );
};
