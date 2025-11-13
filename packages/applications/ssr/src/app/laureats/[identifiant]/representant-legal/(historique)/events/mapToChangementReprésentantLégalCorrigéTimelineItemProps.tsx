import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { getTypeReprésentantLégalLabel } from '../../_helpers/getTypeReprésentantLégalLabel';

export const mapToChangementReprésentantLégalCorrigéTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent,
): TimelineItemProps => {
  const { corrigéLe, corrigéPar, typeReprésentantLégal, nomReprésentantLégal } = event.payload;

  return {
    date: corrigéLe,
    title: 'Demande de changement de représentant légal corrigée',
    acteur: corrigéPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Type :{' '}
          <span className="font-semibold">
            {getTypeReprésentantLégalLabel(typeReprésentantLégal)}
          </span>
        </div>
        <div>
          Nom : <span className="font-semibold">{nomReprésentantLégal}</span>
        </div>
      </div>
    ),
  };
};
