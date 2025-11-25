import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { ReadMore } from '@/components/atoms/ReadMore';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToNomProjetModifiéTimelineItemProps = (
  event: Lauréat.NomProjetModifiéEvent,
): TimelineItemProps => {
  const {
    nomProjet,
    modifiéLe,
    modifiéPar,
    raison,
    identifiantProjet,
    pièceJustificative,
    ancienNomProjet,
  } = event.payload;

  return {
    date: modifiéLe,
    title: 'Nom du projet modifié',
    acteur: modifiéPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouveau nom : <span className="font-semibold">{nomProjet}</span>
        </div>
        <div>
          Ancien nom : <span className="font-semibold">{ancienNomProjet}</span>
        </div>
        {raison && (
          <div>
            Raison : <ReadMore text={raison} className="font-semibold" />
          </div>
        )}
        {pièceJustificative && (
          <>
            <DownloadDocument
              className="mb-0"
              label="Télécharger la pièce justificative"
              format="pdf"
              url={Routes.Document.télécharger(
                DocumentProjet.convertirEnValueType(
                  identifiantProjet,
                  Lauréat.TypeDocumentNomProjet.pièceJustificative.formatter(),
                  modifiéLe,
                  pièceJustificative.format,
                ).formatter(),
              )}
            />
          </>
        )}
      </div>
    ),
  };
};
