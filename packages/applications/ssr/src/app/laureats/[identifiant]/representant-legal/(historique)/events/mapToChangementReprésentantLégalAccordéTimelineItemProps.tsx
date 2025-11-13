import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { getTypeReprésentantLégalLabel } from '../../_helpers/getTypeReprésentantLégalLabel';

export const mapToChangementReprésentantLégalAccordéTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAccordéEvent,
): TimelineItemProps => {
  const { accordéLe, accordéPar, nomReprésentantLégal, typeReprésentantLégal, accordAutomatique } =
    event.payload;

  return {
    date: accordéLe,
    title: accordAutomatique
      ? `Demande de changement de représentant légal accordée par le préfet de la région du projet`
      : `Demande de changement de représentant légal accordée`,
    acteur: accordAutomatique ? undefined : accordéPar,
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
