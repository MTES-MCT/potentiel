import { Lauréat } from '@potentiel-domain/projet';

export const mapToinstallationAvecDispositifDeStockageModifiéeTimelineItemsProps = (
  record: Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageModifiéeEvent,
) => {
  const {
    modifiéeLe,
    modifiéePar,
    dispositifDeStockage: {
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKw,
      puissanceDuDispositifDeStockageEnKw,
    },
  } = record.payload;

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
            {installationAvecDispositifDeStockage ? 'avec' : 'sans'}
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
        </div>
      </div>
    ),
  };
};
