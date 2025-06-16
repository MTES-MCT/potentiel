import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Actionnaire } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToEventTimelineItemsProps } from '../../mapToEventTimelineItemsProps.type';

export const mapToChangementActionnaireDemandéTimelineItemProps: MapToEventTimelineItemsProps = (
  demandeChangement,
  icon,
) => {
  const {
    demandéLe,
    demandéPar,
    identifiantProjet,
    pièceJustificative: { format },
    actionnaire,
  } = demandeChangement.payload as Actionnaire.ChangementActionnaireDemandéEvent['payload'];

  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
    demandéLe,
    format,
  ).formatter();

  return {
    date: demandéLe,
    icon,
    title: (
      <div>
        Demande de changement d'actionnaire déposée par{' '}
        {<span className="font-semibold">{demandéPar}</span>}
      </div>
    ),
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
      </div>
    ),
  };
};
