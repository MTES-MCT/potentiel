import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToInstallateurModifiéTimelineItemsProps = (
  event: Lauréat.Installation.InstallateurModifiéEvent,
): TimelineItemProps => {
  const { modifiéLe, modifiéPar, installateur } = event.payload;

  return {
    date: modifiéLe,
    title: 'Installateur modifié',
    acteur: modifiéPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel installateur : <span className="font-semibold">{installateur}</span>
        </div>
      </div>
    ),
  };
};
