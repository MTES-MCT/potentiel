import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementPuissanceAccordéTimelineItemProps = (
  event: Lauréat.Puissance.ChangementPuissanceAccordéEvent,
  unitéPuissance: string,
): TimelineItemProps => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée,
    nouvellePuissance,
    nouvellePuissanceDeSite,
    estUneDécisionDEtat,
  } = event.payload;

  return {
    date: accordéLe,
    title: 'Changement de puissance accordé',
    actor: accordéPar,
    file: réponseSignée && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Puissance.TypeDocumentPuissance.changementAccordé.formatter(),
        accordéLe,
        réponseSignée.format,
      ),
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la demande de changement de puissance accordée le ${accordéLe}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {nouvellePuissance} {unitéPuissance}
          </span>
        </div>
        {nouvellePuissanceDeSite !== undefined ? (
          <div>
            Nouvelle puissance de site :{' '}
            <span className="font-semibold">
              {nouvellePuissanceDeSite} {unitéPuissance}
            </span>
          </div>
        ) : null}
        <div>
          Fait suite à une décision de l'État :{' '}
          <span className="font-semibold">{estUneDécisionDEtat ? 'Oui' : 'Non'}</span>
        </div>
      </div>
    ),
  };
};
