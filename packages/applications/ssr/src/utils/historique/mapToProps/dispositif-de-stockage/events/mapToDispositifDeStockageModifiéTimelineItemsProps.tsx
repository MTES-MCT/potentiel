import { Lauréat } from '@potentiel-domain/projet';

export const mapTodispositifDeStockagemodifiéTimelineItemsProps = (
  record: Lauréat.DispositifDeStockage.DispositifDeStockageModifiéEvent,
) => {
  const {
    modifiéLe,
    modifiéPar,
    dispositifDeStockage: {
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKW,
      puissanceDuDispositifDeStockageEnKW,
    },
  } = record.payload;

  return {
    date: modifiéLe,
    title: (
      <div>
        Installation avec dispositif de stockage modifié par{' '}
        {<span className="font-semibold">{modifiéPar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Dispositif de stockage :{' '}
          <span className="font-semibold">
            {installationAvecDispositifDeStockage ? 'avec' : 'sans'}
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
        </div>
      </div>
    ),
  };
};
