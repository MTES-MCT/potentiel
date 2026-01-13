import { DocumentProjet } from '@potentiel-domain/projet';
import { Éliminé } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToRecoursDemandéHistoriqueDemandeTimelineItemProps = (
  event: Éliminé.Recours.RecoursDemandéEvent,
): TimelineItemProps => {
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
      ariaLabel: `Télécharger le justificatif joint à la demande de recours déposée le ${formatDateToText(demandéLe)}`,
    },
  };
};
