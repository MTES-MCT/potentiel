import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Éliminé } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToRecoursDemandéTimelineItemProps = ({
  event,
  isHistoriqueProjet,
}: {
  event: Éliminé.Recours.RecoursDemandéEvent;
  isHistoriqueProjet?: true;
}): TimelineItemProps => {
  const {
    demandéLe,
    demandéPar,
    identifiantProjet,
    pièceJustificative: { format },
  } = event.payload;

  return {
    date: demandéLe,
    title: 'Demande de recours déposée',
    actor: demandéPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Éliminé.Recours.TypeDocumentRecours.pièceJustificative.formatter(),
        demandéLe,
        format,
      ),
      ariaLabel: `Télécharger le justificatif joint pour la demande de recours déposée le ${formatDateToText(demandéLe)}`,
    },
    redirect: isHistoriqueProjet
      ? {
          label: 'Détail de la demande',
          ariaLabel: `Aller sur la page du détail du recours déposé le ${formatDateToText(demandéLe)}`,
          url: Routes.Recours.détail(identifiantProjet, demandéLe),
        }
      : undefined,
  };
};
