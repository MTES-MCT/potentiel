import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapTodispositifDeStockagemodifiéTimelineItemsProps = (
  event: Lauréat.DispositifDeStockage.DispositifDeStockageModifiéEvent,
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
    title: 'Installation avec dispositif de stockage modifié',
    acteur: modifiéPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Dispositif de stockage :{' '}
          <span className="font-semibold">
            {installationAvecDispositifDeStockage ? 'avec' : 'sans'}
          </span>
          {puissanceDuDispositifDeStockageEnKW !== undefined ? (
            <span>
              Puissance du dispositif de stockage : ${puissanceDuDispositifDeStockageEnKW} kW
            </span>
          ) : null}
          {capacitéDuDispositifDeStockageEnKWh !== undefined ? (
            <span>
              Capacité du dispositif de stockage : ${capacitéDuDispositifDeStockageEnKWh} kWh
            </span>
          ) : null}
        </div>
      </div>
    ),
  };
};
