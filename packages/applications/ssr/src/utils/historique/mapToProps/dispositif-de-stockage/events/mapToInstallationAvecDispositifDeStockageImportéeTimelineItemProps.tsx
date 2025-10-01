import { Lauréat } from '@potentiel-domain/projet';

export const mapToInstallationAvecDispositifDeStockageImportéTimelineItemProps = (
  record: Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageImportéeEvent,
) => {
  const {
    importéeLe,
    dispositifDeStockage: {
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKw,
      puissanceDuDispositifDeStockageEnKw,
    },
  } = record.payload;
  return {
    date: importéeLe,
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
