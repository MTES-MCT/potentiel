import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAbandonDemandéTimelineItemProps = (
  event: Lauréat.Abandon.AbandonDemandéEvent | Lauréat.Abandon.AbandonDemandéEventV1,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
): TimelineItemProps => {
  const { demandéLe, demandéPar, identifiantProjet, pièceJustificative } = event.payload;
  const afficherLien = rôleUtilisateur.aLaPermission('abandon.consulter.demande');

  return {
    date: demandéLe,
    title: "Demande d'abandon déposée",
    actor: demandéPar,
    file: pièceJustificative && {
      document: Lauréat.Abandon.DocumentAbandon.pièceJustificative({
        identifiantProjet,
        demandéLe,
        pièceJustificative,
      }),
      ariaLabel: `Télécharger le justificatif de la demande d'abandon en date du ${formatDateToText(demandéLe)}`,
    },
    link: afficherLien
      ? {
          url: Routes.Abandon.détail(identifiantProjet, demandéLe),
          ariaLabel: `Voir le détail de la demande d'abandon en date du ${formatDateToText(demandéLe)}`,
          label: 'Détail de la demande',
        }
      : undefined,
    details: (
      <>
        {event.type === 'AbandonDemandé-V2' && event.payload.ppaSignalé && (
          <div className="mb-4">
            Le projet a été déclaré comme étant signataire d'un{' '}
            <span className="font-semibold">contrat de vente de gré à gré (PPA)</span>.
          </div>
        )}
        {event.type === 'AbandonDemandé-V1' && event.payload.recandidature && (
          <div className="mb-4">
            Le projet s'inscrit dans un{' '}
            <span className="font-semibold">contexte de recandidature</span>.
          </div>
        )}
      </>
    ),
  };
};
