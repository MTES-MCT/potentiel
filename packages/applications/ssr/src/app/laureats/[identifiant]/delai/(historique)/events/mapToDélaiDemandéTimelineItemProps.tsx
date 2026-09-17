import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDélaiDemandéTimelineItemProps = (
  event: Lauréat.Délai.DélaiDemandéEvent,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
): TimelineItemProps => {
  const { identifiantProjet, demandéLe, demandéPar, pièceJustificative, nombreDeMois, raison } =
    event.payload;

  const afficherLien = rôleUtilisateur.aLaPermission('délai.consulterDemande');

  return {
    date: demandéLe,
    title: 'Délai demandé',
    actor: demandéPar,
    file: pièceJustificative && {
      document: Lauréat.Délai.DocumentDélai.pièceJustificative(event.payload),
      ariaLabel: `Télécharger le justificatif de la demande de délai en date du ${formatDateToText(demandéLe)}`,
    },
    link: afficherLien
      ? {
          url: Routes.Délai.détail(identifiantProjet, demandéLe),
          ariaLabel: `Voir le détail de la demande de délai en date du ${formatDateToText(demandéLe)}`,
          label: 'Détail de la demande',
        }
      : undefined,
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Durée : <span className="font-semibold">{nombreDeMois} mois</span>
        </div>
      </div>
    ),
    reason: raison,
  };
};
