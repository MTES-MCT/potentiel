import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToChangementPuissanceAccordéTimelineItemProps = (
  record: Lauréat.Puissance.ChangementPuissanceAccordéEvent,
  unitéPuissance: string,
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée,
    nouvellePuissance,
    estUneDécisionDEtat,
  } = record.payload;

  const réponseSignéeDocument = réponseSignée
    ? DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Puissance.TypeDocumentPuissance.changementAccordé.formatter(),
        accordéLe,
        réponseSignée.format,
      ).formatter()
    : undefined;

  return {
    date: accordéLe,
    title: (
      <div>
        Changement de puissance accordé <TimelineItemUserEmail email={accordéPar} />
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {nouvellePuissance} {unitéPuissance}
          </span>
        </div>
        <div>
          Fait suite à une décision de l'État :{' '}
          <span className="font-semibold">{estUneDécisionDEtat ? 'Oui' : 'Non'}</span>
        </div>
        {réponseSignéeDocument && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la réponse signée"
            format="pdf"
            url={Routes.Document.télécharger(réponseSignéeDocument)}
          />
        )}
      </div>
    ),
  };
};
