import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToInstallateurModifiéTimelineItemsProps = (
  record: Lauréat.Installation.InstallateurModifiéEvent,
) => {
  const { modifiéLe, modifiéPar, installateur } = record.payload;

  return {
    date: modifiéLe,
    title: (
      <div>
        Installateur modifié
        <TimelineItemUserEmail email={modifiéPar} />
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel installateur : <span className="font-semibold">{installateur}</span>
        </div>
      </div>
    ),
  };
};
