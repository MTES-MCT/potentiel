import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDispositifDeStockageModifiéTimelineItemsProps = (
  event:
    | Lauréat.Installation.DispositifDeStockageModifiéEvent
    | Lauréat.Installation.ChangementDispositifDeStockageEnregistréEvent,
): TimelineItemProps => {
  const {
    dispositifDeStockage: {
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKWh,
      puissanceDuDispositifDeStockageEnKW,
    },
  } = event.payload;

  return {
    date:
      event.type === 'ChangementDispositifDeStockageEnregistré-V1'
        ? event.payload.enregistréLe
        : event.payload.modifiéLe,
    acteur:
      event.type === 'ChangementDispositifDeStockageEnregistré-V1'
        ? event.payload.enregistréPar
        : event.payload.modifiéPar,
    title: 'Dispositif de stockage modifié',
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
