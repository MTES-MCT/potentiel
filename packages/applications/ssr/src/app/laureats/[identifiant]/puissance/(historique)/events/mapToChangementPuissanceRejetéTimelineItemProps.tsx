import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementPuissanceRejetéTimelineItemProps = (
  event: Lauréat.Puissance.ChangementPuissanceRejetéEvent,
): TimelineItemProps => {
  const {
    rejetéLe,
    rejetéPar,
    identifiantProjet,
    réponseSignée: { format },
    estUneDécisionDEtat,
  } = event.payload;

  return {
    date: rejetéLe,
    title: 'Changement de puissance rejeté',
    actor: rejetéPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Puissance.TypeDocumentPuissance.changementRejeté.formatter(),
        rejetéLe,
        format,
      ),
      ariaLabel: `Télécharger la réponse signée de la demande de changement de puissance rejetée le ${formatDateToText(rejetéLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Fait suite à une décision de l'État :{' '}
          <span className="font-semibold">{estUneDécisionDEtat ? 'Oui' : 'Non'}</span>
        </div>
      </div>
    ),
  };
};
