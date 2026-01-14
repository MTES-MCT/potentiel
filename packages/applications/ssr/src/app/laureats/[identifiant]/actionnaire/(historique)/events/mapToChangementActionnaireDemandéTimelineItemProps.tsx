import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementActionnaireDemandéTimelineItemProps = (
  event: Lauréat.Actionnaire.ChangementActionnaireDemandéEvent,
): TimelineItemProps => {
  const {
    demandéLe,
    demandéPar,
    identifiantProjet,
    pièceJustificative: { format },
    actionnaire,
  } = event.payload;

  return {
    date: demandéLe,
    title: "Demande de changement d'actionnaire déposée",
    actor: demandéPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
        demandéLe,
        format,
      ),
      ariaLabel: `Télécharger le justificatif de la demande de changement d'actionnaire déposée le ${formatDateToText(demandéLe)}`,
    },
    redirect: {
      url: Routes.Actionnaire.changement.détails(identifiantProjet, demandéLe),
      ariaLabel: `Voir le détail de la demande de changement d'actionnaire déposée le ${FormattedDate({ date: demandéLe })}`,
      label: 'Détail de la demande',
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel actionnaire : <span className="font-semibold">{actionnaire}</span>
        </div>
      </div>
    ),
  };
};
