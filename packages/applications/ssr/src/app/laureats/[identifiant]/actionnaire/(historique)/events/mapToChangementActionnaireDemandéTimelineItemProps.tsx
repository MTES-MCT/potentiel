import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementActionnaireDemandéTimelineItemProps = (
  event: Lauréat.Actionnaire.ChangementActionnaireDemandéEvent,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
): TimelineItemProps => {
  const {
    demandéLe,
    demandéPar,
    identifiantProjet,
    pièceJustificative: { format },
    actionnaire,
  } = event.payload;

  const afficherLien = rôleUtilisateur.aLaPermission('actionnaire.consulterChangement');

  return {
    date: demandéLe,
    title: "Demande de changement d'actionnaire déposée",
    actor: demandéPar,
    file: {
      document: Lauréat.Actionnaire.DocumentActionnaire.pièceJustificative({
        identifiantProjet,
        demandéLe,
        pièceJustificative: {
          format,
        },
      }),
      label: 'Télécharger le justificatif de la demande',
      ariaLabel: `Télécharger le justificatif de la demande de changement d'actionnaire en date du ${formatDateToText(demandéLe)}`,
    },
    link: afficherLien
      ? {
          url: Routes.Actionnaire.changement.détails(identifiantProjet, demandéLe),
          ariaLabel: `Voir le détail de la demande de changement d'actionnaire en date du ${formatDateToText(demandéLe)}`,
          label: 'Détail de la demande',
        }
      : undefined,
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel actionnaire : <span className="font-semibold">{actionnaire}</span>
        </div>
      </div>
    ),
  };
};
