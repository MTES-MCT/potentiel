import { Lauréat } from '@potentiel-domain/projet';

export const mapToInstallationAvecDispositifDeStockageImportéTimelineItemProps = (
  record: Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageImportéeEvent,
) => {
  const { importéeLe, installationAvecDispositifDeStockage } = record.payload;
  return {
    date: importéeLe,
    title: (
      <div>
        Candidature :{' '}
        {
          <span className="font-semibold">
            {installationAvecDispositifDeStockage ? 'oui' : 'non'}
          </span>
        }
      </div>
    ),
  };
};
