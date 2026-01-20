import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementInstallateurEnregistréTimelineItemsProps = (
  event: Lauréat.Installation.ChangementInstallateurEnregistréEvent,
): TimelineItemProps => {
  const { enregistréLe, enregistréPar, installateur, identifiantProjet } = event.payload;

  return {
    date: enregistréLe,
    title: 'Installateur modifié',
    actor: enregistréPar,
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel installateur : <span className="font-semibold">{installateur}</span>
        </div>
      </div>
    ),
    link: {
      url: Routes.Installation.changement.installateur.détails(identifiantProjet, enregistréLe),
      label: 'Détail du changement',
      ariaLabel: `Voir le détail du changement d'installateur enregistré le ${formatDateToText(enregistréLe)}`,
    },
  };
};
