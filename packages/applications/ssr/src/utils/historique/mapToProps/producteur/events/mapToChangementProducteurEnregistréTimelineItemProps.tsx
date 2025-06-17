import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToProducteurTimelineItemProps } from '../mapToProducteurTimelineItemProps';

export const mapToChangementProducteurEnregistréTimelineItemProps: MapToProducteurTimelineItemProps =
  (record, icon) => {
    const {
      enregistréLe,
      enregistréPar,
      identifiantProjet,
      pièceJustificative,
      producteur,
      raison,
    } = record.payload as Lauréat.Producteur.ChangementProducteurEnregistréEvent['payload'];
    return {
      date: enregistréLe,
      icon,
      title: (
        <div>Producteur modifié par {<span className="font-semibold">{enregistréPar}</span>}</div>
      ),
      content: (
        <div className="flex flex-col gap-2">
          <div>
            Nouveau producteur : <span className="font-semibold">{producteur}</span>
          </div>
          {raison && (
            <div>
              Raison : <span className="font-semibold">{raison}</span>
            </div>
          )}
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Lauréat.Producteur.TypeDocumentProducteur.pièceJustificative.formatter(),
                enregistréLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        </div>
      ),
    };
  };
