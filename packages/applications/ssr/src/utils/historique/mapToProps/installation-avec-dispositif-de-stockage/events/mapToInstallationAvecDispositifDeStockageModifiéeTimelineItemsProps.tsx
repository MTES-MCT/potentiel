import { Lauréat } from '@potentiel-domain/projet';

// viovio affichage
export const mapToinstallationAvecDispositifDeStockageModifiéeTimelineItemsProps = (
  record: Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageModifiéeEvent,
) => {
  const { modifiéeLe, modifiéePar, dispositifDeStockage } = record.payload;

  return {
    date: modifiéeLe,
    title: (
      <div>
        Installation avec dispositif de stockage modifiée par{' '}
        {<span className="font-semibold">{modifiéePar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Dispositif de stockage :{' '}
          <span className="font-semibold">
            {dispositifDeStockage.installationAvecDispositifDeStockage ? 'avec' : 'sans'}
          </span>
        </div>
      </div>
    ),
  };
};
