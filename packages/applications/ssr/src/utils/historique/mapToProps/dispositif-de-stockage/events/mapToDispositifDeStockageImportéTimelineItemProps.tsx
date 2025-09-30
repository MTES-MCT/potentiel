import { Lauréat } from '@potentiel-domain/projet';

export const mapToDispositifDeStockageImportéTimelineItemProps = (
  record: Lauréat.DispositifDeStockage.DispositifDeStockageImportéEvent,
) => {
  const {
    importéLe,
    dispositifDeStockage: {
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKW,
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
                Puissance du dispositif de stockage : ${puissanceDuDispositifDeStockageEnKW} Kw
              </span>
            ) : null}
            {capacitéDuDispositifDeStockageEnKW !== undefined ? (
              <span>
                Capacité du dispositif de stockage : ${capacitéDuDispositifDeStockageEnKW} Kw
              </span>
            ) : null}
          </>
        }
      </div>
    ),
  };
};
