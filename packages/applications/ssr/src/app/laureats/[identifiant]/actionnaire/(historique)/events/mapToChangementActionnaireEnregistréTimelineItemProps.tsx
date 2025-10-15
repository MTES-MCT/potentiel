import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ReadMore } from '@/components/atoms/ReadMore';

export const mapToChangementActionnaireEnregistréTimelineItemProps = (
  modification: Lauréat.Actionnaire.ChangementActionnaireEnregistréEvent,
) => {
  const {
    enregistréLe,
    enregistréPar,
    identifiantProjet,
    pièceJustificative,
    actionnaire,
    raison,
  } = modification.payload;
  return {
    date: enregistréLe,
    title: (
      <div>Actionnaire modifié par {<span className="font-semibold">{enregistréPar}</span>}</div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel actionnaire : <span className="font-semibold">{actionnaire}</span>
        </div>
        <div>
          Raison : <ReadMore text={raison} className="font-semibold" />
        </div>

        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(
            DocumentProjet.convertirEnValueType(
              identifiantProjet,
              Lauréat.Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
              enregistréLe,
              pièceJustificative.format,
            ).formatter(),
          )}
        />
      </div>
    ),
  };
};
