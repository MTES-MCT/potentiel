import { Lauréat } from '@potentiel-domain/projet';

export const mapToinstallationAvecDispositifDeStockageModifiéeTimelineItemsProps = (
  record: Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageModifiéeEvent,
) => {
  const { modifiéeLe, modifiéePar, installationAvecDispositifDeStockage } = record.payload;

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
          Nouvelle valeur pour installation avec dispositif de stockage :{' '}
          <span className="font-semibold">
            {installationAvecDispositifDeStockage ? 'oui' : 'non'}
          </span>
        </div>
      </div>
    ),
  };
};
