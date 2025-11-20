import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

type DétailsDispositifDeStockageProps = {
  dispositifDeStockage: Lauréat.Installation.DispositifDeStockage.RawType;
};

export const DétailsDispositifDeStockage: FC<DétailsDispositifDeStockageProps> = ({
  dispositifDeStockage: {
    installationAvecDispositifDeStockage,
    capacitéDuDispositifDeStockageEnKWh,
    puissanceDuDispositifDeStockageEnKW,
  },
}) => (
  <div>
    Dispositif de stockage :{' '}
    <span className="font-semibold">{installationAvecDispositifDeStockage ? 'avec' : 'sans'}</span>
    {puissanceDuDispositifDeStockageEnKW !== undefined ? (
      <div>Puissance du dispositif de stockage : {puissanceDuDispositifDeStockageEnKW} kW</div>
    ) : null}
    {capacitéDuDispositifDeStockageEnKWh !== undefined ? (
      <div>Capacité du dispositif de stockage : {capacitéDuDispositifDeStockageEnKWh} kWh</div>
    ) : null}
  </div>
);
