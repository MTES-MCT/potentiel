import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDispositifDeStockageImportéTimelineItemProps = (
  event: Lauréat.DispositifDeStockage.DispositifDeStockageImportéEvent,
): TimelineItemProps => {
  const {
    importéLe,
    dispositifDeStockage: {
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKWh,
      puissanceDuDispositifDeStockageEnKW,
    },
  } = event.payload;
  return {
    date: importéLe,
    title: (
      <>
        Candidature :{' '}
        {
          <>
            <span className="font-semibold">
              {installationAvecDispositifDeStockage ? 'oui' : 'non'}
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
          </>
        }
      </>
    ),
  };
};
