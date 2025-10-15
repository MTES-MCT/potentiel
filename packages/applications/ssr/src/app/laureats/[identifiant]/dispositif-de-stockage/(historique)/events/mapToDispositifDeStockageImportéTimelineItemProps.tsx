import { Lauréat } from '@potentiel-domain/projet';

export const mapToDispositifDeStockageImportéTimelineItemProps = (
  record: Lauréat.DispositifDeStockage.DispositifDeStockageImportéEvent,
) => {
  const {
    importéLe,
    dispositifDeStockage: {
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKWh,
      puissanceDuDispositifDeStockageEnKW,
    },
  } = record.payload;
  return {
    date: importéLe,
    title: (
      <div>
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
      </div>
    ),
  };
};
