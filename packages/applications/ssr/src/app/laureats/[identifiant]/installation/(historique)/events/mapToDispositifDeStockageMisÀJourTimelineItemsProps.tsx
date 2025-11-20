import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { DétailsDispositifDeStockage } from '../../dispositif-de-stockage/DétailsDispositifDeStockage';

export const mapToDispositifDeStockageMisÀJourTimelineItemsProps = (
  event:
    | Lauréat.Installation.DispositifDeStockageModifiéEvent
    | Lauréat.Installation.ChangementDispositifDeStockageEnregistréEvent,
): TimelineItemProps => {
  const { dispositifDeStockage } = event.payload;

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
        <DétailsDispositifDeStockage dispositifDeStockage={dispositifDeStockage} />
      </div>
    ),
  };
};
