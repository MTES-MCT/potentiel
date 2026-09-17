import { Routes } from '@potentiel-applications/routes';
import { Éliminé } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';
import { Utilisateur } from '@potentiel-domain/utilisateur';

export const mapToRecoursDemandéTimelineItemProps = (
  event: Éliminé.Recours.RecoursDemandéEvent,
  rôleUtilisateur: Utilisateur.ValueType['rôle']
): TimelineItemProps => {
  const {
    demandéLe,
    demandéPar,
    identifiantProjet,
    pièceJustificative: { format },
  } = event.payload;

  const afficherLien = rôleUtilisateur.aLaPermission('recours.consulter.détail')

  return {
    date: demandéLe,
    title: 'Demande de recours déposée',
    actor: demandéPar,
    file: {
      document: Éliminé.Recours.DocumentRecours.pièceJustificative({
        identifiantProjet,
        demandéLe,
        pièceJustificative: {
          format,
        },
      }),
      ariaLabel: `Télécharger le justificatif de la demande de recours en date du ${formatDateToText(demandéLe)}`,
    },
    link: afficherLien ?{
      label: 'Détail de la demande',
      ariaLabel: `Aller sur la page du détail du recours déposé le ${formatDateToText(demandéLe)}`,
      url: Routes.Recours.détail(identifiantProjet, demandéLe),
    }: undefined,
  };
};
