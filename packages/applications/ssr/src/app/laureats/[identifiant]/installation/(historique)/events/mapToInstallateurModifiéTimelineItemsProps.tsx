import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { ReadMore } from '@/components/atoms/ReadMore';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToInstallateurModifiéTimelineItemsProps = (
  event: Lauréat.Installation.InstallateurModifiéEvent,
): TimelineItemProps => {
  const { modifiéLe, modifiéPar, installateur, raison, pièceJustificative, identifiantProjet } =
    event.payload;

  return {
    date: modifiéLe,
    title: 'Installateur modifié',
    acteur: modifiéPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel installateur : <span className="font-semibold">{installateur}</span>
        </div>
        {raison && (
          <div>
            Raison : <ReadMore text={raison} className="font-semibold" />
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
                Lauréat.Installation.TypeDocumentInstallateur.pièceJustificative.formatter(),
                modifiéLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
      </div>
    ),
  };
};
