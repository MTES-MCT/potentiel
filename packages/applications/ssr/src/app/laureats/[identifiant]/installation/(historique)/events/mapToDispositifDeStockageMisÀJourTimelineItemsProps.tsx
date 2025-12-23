import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { ReadMore } from '@/components/atoms/ReadMore';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { DétailsDispositifDeStockage } from '../../dispositif-de-stockage/DétailsDispositifDeStockage';

export const mapToDispositifDeStockageMisÀJourTimelineItemsProps = (
  event:
    | Lauréat.Installation.DispositifDeStockageModifiéEvent
    | Lauréat.Installation.ChangementDispositifDeStockageEnregistréEvent,
): TimelineItemProps => {
  const { dispositifDeStockage, raison, pièceJustificative, identifiantProjet } = event.payload;

  return {
    date:
      event.type === 'ChangementDispositifDeStockageEnregistré-V1'
        ? event.payload.enregistréLe
        : event.payload.modifiéLe,
    acteur:
      event.type === 'ChangementDispositifDeStockageEnregistré-V1'
        ? event.payload.enregistréPar
        : event.payload.modifiéPar,
    title: 'Dispositif de stockage modifié',
    content: (
      <div className="flex flex-col gap-2">
        <DétailsDispositifDeStockage dispositifDeStockage={dispositifDeStockage} />
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
                Lauréat.Installation.TypeDocumentDispositifDeStockage.pièceJustificative.formatter(),
                event.type == 'ChangementDispositifDeStockageEnregistré-V1'
                  ? event.payload.enregistréLe
                  : event.payload.modifiéLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
      </div>
    ),
  };
};
