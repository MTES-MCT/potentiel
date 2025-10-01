import { Lauréat } from '@potentiel-domain/projet';

// viovio affichage
export const mapToInstallationAvecDispositifDeStockageImportéTimelineItemProps = (
  record: Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageImportéeEvent,
) => {
  const { importéeLe, dispositifDeStockage } = record.payload;
  return {
    date: importéeLe,
    title: (
      <div>
        Candidature :{' '}
        {
          <span className="font-semibold">
            {dispositifDeStockage.installationAvecDispositifDeStockage ? 'oui' : 'non'}
          </span>
        }
      </div>
    ),
  };
};
