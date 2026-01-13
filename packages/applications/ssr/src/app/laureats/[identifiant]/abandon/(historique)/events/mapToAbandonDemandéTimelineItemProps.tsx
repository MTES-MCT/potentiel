import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { formatDateToText } from '@/app/_helpers';

export const mapToAbandonDemandéTimelineItemProps = ({
  event,
  isHistoriqueProjet,
}: {
  event: Lauréat.Abandon.AbandonDemandéEvent | Lauréat.Abandon.AbandonDemandéEventV1;
  isHistoriqueProjet?: true;
}): TimelineItemProps => {
  const { demandéLe, demandéPar, identifiantProjet, pièceJustificative } = event.payload;

  return {
    date: demandéLe,
    title: "Demande d'abandon déposée",
    actor: demandéPar,
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Abandon.TypeDocumentAbandon.pièceJustificative.formatter(),
        demandéLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif de la demande d'abandon déposée le ${formatDateToText(demandéLe)}`,
    },
    redirect: isHistoriqueProjet && {
      url: Routes.Abandon.détail(identifiantProjet, demandéLe),
      ariaLabel: `Voir le détail de la demande d'abandon déposée le ${FormattedDate({ date: demandéLe })}`,
      label: 'Détail de la demande',
    },
    details: (
      <>
        {event.type === 'AbandonDemandé-V1' && event.payload.recandidature && (
          <div className="mb-4">
            Le projet s'inscrit dans un{' '}
            <span className="font-semibold">contexte de recandidature</span>
          </div>
        )}
      </>
    ),
  };
};
