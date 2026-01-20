import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToDélaiDemandéTimelineItemProps = (
  event: Lauréat.Délai.DélaiDemandéEvent,
): TimelineItemProps => {
  const { identifiantProjet, demandéLe, demandéPar, pièceJustificative, nombreDeMois, raison } =
    event.payload;

  return {
    date: demandéLe,
    title: 'Délai demandé',
    actor: demandéPar,
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Délai.TypeDocumentDemandeDélai.pièceJustificative.formatter(),
        demandéLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif de la demande de délai en date du ${formatDateToText(demandéLe)}`,
    },
    link: {
      url: Routes.Délai.détail(identifiantProjet, demandéLe),
      ariaLabel: `Voir le détail de la demande de délai en date du ${formatDateToText(demandéLe)}`,
      label: 'Détail de la demande',
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Durée : <span className="font-semibold">{nombreDeMois} mois</span>
        </div>
      </div>
    ),
    reason: raison,
  };
};
