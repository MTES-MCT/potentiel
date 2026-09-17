import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';
import { getTypeReprésentantLégalLabel } from '../../_helpers/getTypeReprésentantLégalLabel';

export const mapToChangementReprésentantLégalDemandéTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
): TimelineItemProps => {
  const { demandéLe, demandéPar, typeReprésentantLégal, nomReprésentantLégal, identifiantProjet } =
    event.payload;

  const afficherLien = rôleUtilisateur.aLaPermission('représentantLégal.consulterChangement');

  return {
    date: demandéLe,
    title: 'Demande de changement de représentant légal déposée',
    actor: demandéPar,
    link: afficherLien
      ? {
          url: Routes.ReprésentantLégal.changement.détails(identifiantProjet, demandéLe),
          ariaLabel: `Voir le détail de la demande de changement de représentant légal en date du ${formatDateToText(demandéLe)}`,
          label: 'Détail de la demande',
        }
      : undefined,
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
  };
};
