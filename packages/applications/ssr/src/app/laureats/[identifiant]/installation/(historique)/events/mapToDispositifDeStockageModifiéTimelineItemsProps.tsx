import { Lauréat } from '@potentiel-domain/projet';

export const mapTodispositifDeStockagemodifiéTimelineItemsProps = (
  record: Lauréat.Installation.DispositifDeStockageModifiéEvent,
) => {
  const {
    modifiéLe,
    modifiéPar,
    dispositifDeStockage: {
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKWh,
      puissanceDuDispositifDeStockageEnKW,
    },
  } = record.payload;

  return {
    date: modifiéLe,
    title: (
      <div>
        Dispositif de stockage modifié par {<span className="font-semibold">{modifiéPar}</span>}
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
            <div>
              Puissance du dispositif de stockage : {puissanceDuDispositifDeStockageEnKW} kW
            </div>
          ) : null}
          {capacitéDuDispositifDeStockageEnKWh !== undefined ? (
            <div>
              Capacité du dispositif de stockage : {capacitéDuDispositifDeStockageEnKWh} kWh
            </div>
          ) : null}
        </div>
      </div>
    ),
  };
};
