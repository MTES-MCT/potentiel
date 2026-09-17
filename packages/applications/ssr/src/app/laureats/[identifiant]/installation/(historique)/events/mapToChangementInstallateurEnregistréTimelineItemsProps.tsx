import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementInstallateurEnregistréTimelineItemsProps = (
  event: Lauréat.Installation.ChangementInstallateurEnregistréEvent,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
): TimelineItemProps => {
  const { enregistréLe, enregistréPar, installateur, identifiantProjet } = event.payload;

  const afficherLien = rôleUtilisateur.aLaPermission(
    'installation.installateur.consulterChangement',
  );

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
    link: afficherLien
      ? {
          url: Routes.Installation.changement.installateur.détails(identifiantProjet, enregistréLe),
          label: 'Détail du changement',
          ariaLabel: `Voir le détail du changement d'installateur enregistré le ${formatDateToText(enregistréLe)}`,
        }
      : undefined,
  };
};
