import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementInstallateurEnregistréTimelineItemsProps = (
  event: Lauréat.Installation.ChangementInstallateurEnregistréEvent,
): TimelineItemProps => {
  const { enregistréLe, enregistréPar, installateur } = event.payload;

  return {
    date: enregistréLe,
    title: 'Installateur modifié',
    acteur: enregistréPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel installateur : <span className="font-semibold">{installateur}</span>
        </div>
      </div>
    ),
  };
};
