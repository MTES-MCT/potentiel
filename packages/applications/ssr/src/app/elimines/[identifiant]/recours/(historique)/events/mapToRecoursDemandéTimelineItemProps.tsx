import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Éliminé } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

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

  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Éliminé.Recours.TypeDocumentRecours.pièceJustificative.formatter(),
    demandéLe,
    format,
  ).formatter();

  return {
    date: demandéLe,
    title: 'Demande de recours déposée',
    acteur: demandéPar,
    content: (
      <div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(pièceJustificative)}
        />
        {isHistoriqueProjet && (
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Recours.détail(identifiantProjet, demandéLe),
            }}
            aria-label={`Voir le détail du recours déposé le ${FormattedDate({ date: demandéLe })}`}
          >
            Détail de la demande
          </Button>
        )}
      </div>
    ),
  };
};
