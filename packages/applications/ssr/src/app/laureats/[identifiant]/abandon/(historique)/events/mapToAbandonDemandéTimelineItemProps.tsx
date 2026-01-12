import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

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
    acteur: demandéPar,
    content: (
      <>
        {event.type === 'AbandonDemandé-V1' && event.payload.recandidature && (
          <div className="mb-4">
            Le projet s'inscrit dans un{' '}
            <span className="font-semibold">contexte de recandidature</span>
          </div>
        )}
        {pièceJustificative && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Lauréat.Abandon.TypeDocumentAbandon.pièceJustificative.formatter(),
                demandéLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
        {isHistoriqueProjet && (
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Abandon.détail(identifiantProjet, demandéLe),
            }}
            aria-label={`Voir le détail de la demande d'abandon déposée le ${FormattedDate({ date: demandéLe })}`}
          >
            Détail de la demande
          </Button>
        )}
      </>
    ),
  };
};
