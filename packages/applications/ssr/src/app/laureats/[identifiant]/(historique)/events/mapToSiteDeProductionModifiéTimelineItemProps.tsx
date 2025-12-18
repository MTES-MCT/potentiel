import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { ReadMore } from '@/components/atoms/ReadMore';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToSiteDeProductionModifiéTimelineItemProps = (
  event: Lauréat.SiteDeProductionModifiéEvent,
): TimelineItemProps => {
  const { localité, modifiéLe, modifiéPar, raison, pièceJustificative, identifiantProjet } =
    event.payload;

  return {
    date: modifiéLe,
    title: 'Site de production modifié',
    acteur: modifiéPar,
    content: (
      <>
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
                Lauréat.Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
                modifiéLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
        <div className="flex flex-col">
          <span className="font-semibold">Nouveau site de production : </span>
          <span>{localité.adresse1}</span>
          {localité.adresse2 && <span>{localité.adresse2}</span>}
          <span>
            {localité.codePostal} {localité.commune}
          </span>
          <span>
            {localité.département} {localité.région}
          </span>
        </div>
      </>
    ),
  };
};
