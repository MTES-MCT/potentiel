import { Lauréat } from '@potentiel-domain/projet';

export const mapToDispositifDeStockageImportéTimelineItemProps = (
  record: Lauréat.DispositifDeStockage.DispositifDeStockageImportéEvent,
) => {
  const {
    importéLe,
    dispositifDeStockage: {
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKw,
      puissanceDuDispositifDeStockageEnKw,
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
            {puissanceDuDispositifDeStockageEnKw !== undefined ? (
              <span>
                Puissance du dispositif de stockage : ${puissanceDuDispositifDeStockageEnKw} Kw
              </span>
            ) : null}
            {capacitéDuDispositifDeStockageEnKw !== undefined ? (
              <span>
                Capacité du dispositif de stockage : ${capacitéDuDispositifDeStockageEnKw} Kw
              </span>
            ) : null}
          </>
        }
      </div>
    ),
  };
};
