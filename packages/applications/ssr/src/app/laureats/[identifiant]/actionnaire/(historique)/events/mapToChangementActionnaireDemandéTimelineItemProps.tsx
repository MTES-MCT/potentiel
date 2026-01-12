import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToChangementActionnaireDemandéTimelineItemProps = ({
  event,
  isHistoriqueProjet,
}: {
  event: Lauréat.Actionnaire.ChangementActionnaireDemandéEvent;
  isHistoriqueProjet?: true;
}): TimelineItemProps => {
  const {
    demandéLe,
    demandéPar,
    identifiantProjet,
    pièceJustificative: { format },
    actionnaire,
  } = event.payload;

  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
    demandéLe,
    format,
  ).formatter();

  return {
    date: demandéLe,
    title: "Demande de changement d'actionnaire déposée",
    acteur: demandéPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel actionnaire : <span className="font-semibold">{actionnaire}</span>
        </div>
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
              href: Routes.Actionnaire.changement.détails(identifiantProjet, demandéLe),
            }}
            aria-label={`Voir le détail de la demande de changement d'actionnaire déposée le ${FormattedDate({ date: demandéLe })}`}
          >
            Détail de la demande
          </Button>
        )}
      </div>
    ),
  };
};
