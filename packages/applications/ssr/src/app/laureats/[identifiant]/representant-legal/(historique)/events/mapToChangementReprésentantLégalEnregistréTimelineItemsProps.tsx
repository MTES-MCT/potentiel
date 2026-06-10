import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';
import { getTypeReprésentantLégalLabel } from '../../_helpers/getTypeReprésentantLégalLabel';

export const mapToChangementReprésentantLégalEnregistréTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalEnregistréEvent,
): TimelineItemProps => {
  const {
    enregistréLe,
    enregistréPar,
    nomReprésentantLégal,
    typeReprésentantLégal,
    identifiantProjet,
  } = event.payload;

  return {
    date: enregistréLe,
    title: 'Représentant légal modifié',
    actor: enregistréPar,
    details: (
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
    link: {
      url: Routes.ReprésentantLégal.changement.détails(identifiantProjet, enregistréLe),
      label: 'Détail du changement',
      ariaLabel: `Voir le détail du changement de représentant légal enregistré le ${formatDateToText(enregistréLe)}`,
    },
  };
};
