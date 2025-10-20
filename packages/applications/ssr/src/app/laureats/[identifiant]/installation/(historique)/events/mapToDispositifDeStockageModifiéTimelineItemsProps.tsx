import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDispositifDeStockageModifiéTimelineItemsProps = (
  event: Lauréat.Installation.DispositifDeStockageModifiéEvent,
): TimelineItemProps => {
  const {
    modifiéLe,
    modifiéPar,
    dispositifDeStockage: {
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKWh,
      puissanceDuDispositifDeStockageEnKW,
    },
  } = event.payload;

  return {
    date: modifiéLe,
    acteur: modifiéPar,
    title: 'Dispositif de stockage modifié',
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Dispositif de stockage :{' '}
          <span className="font-semibold">
            {installationAvecDispositifDeStockage ? 'avec' : 'sans'}
          </span>
          {puissanceDuDispositifDeStockageEnKW !== undefined ? (
            <div>
              Puissance du dispositif de stockage : {puissanceDuDispositifDeStockageEnKW} kW
            </div>
          ) : null}
          {capacitéDuDispositifDeStockageEnKWh !== undefined ? (
            <div>
              Capacité du dispositif de stockage : {capacitéDuDispositifDeStockageEnKWh} kWh
            </div>
          ) : null}
        </div>
      </div>
    ),
  };
};
