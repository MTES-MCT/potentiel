import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDispositifDeStockageImportéTimelineItemProps = (
  event: Lauréat.Installation.InstallationImportéeEvent,
): TimelineItemProps => {
  const { importéeLe, dispositifDeStockage } = event.payload;
  return {
    date: importéeLe,
    title: 'Candidature :',
    content: (
      <>
        {dispositifDeStockage ? (
          <div>
            Dispositif de stockage :{' '}
            <span className="font-semibold">
              {dispositifDeStockage.installationAvecDispositifDeStockage ? 'avec' : 'sans'}
            </span>
            {dispositifDeStockage.puissanceDuDispositifDeStockageEnKW !== undefined ? (
              <div>
                Puissance du dispositif de stockage :{' '}
                {dispositifDeStockage.puissanceDuDispositifDeStockageEnKW} kW
              </div>
            ) : null}
            {dispositifDeStockage.capacitéDuDispositifDeStockageEnKWh !== undefined ? (
              <div>
                Capacité du dispositif de stockage :{' '}
                {dispositifDeStockage.capacitéDuDispositifDeStockageEnKWh} kWh
              </div>
            ) : null}
          </div>
        ) : (
          <div>Dispositif de stockage non renseigné</div>
        )}
      </>
    ),
  };
};
