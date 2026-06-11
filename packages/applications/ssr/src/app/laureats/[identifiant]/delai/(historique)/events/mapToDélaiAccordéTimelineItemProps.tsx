import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDélaiAccordéTimelineItemProps = (
  event: Lauréat.Délai.DélaiAccordéEvent,
): TimelineItemProps => {
  const { accordéPar, accordéLe, nombreDeMois } = event.payload;

  return {
    date: accordéLe,
    title: 'Demande de délai de force majeure accordée',
    actor: accordéPar,
    file: {
      document: Lauréat.Délai.DocumentDélai.demandeAccordée(event.payload),
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la demande de délai accordée le ${formatDateToText(accordéLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Durée : <span className="font-semibold">{nombreDeMois} mois</span>
        </div>
      </div>
    ),
  };
};
