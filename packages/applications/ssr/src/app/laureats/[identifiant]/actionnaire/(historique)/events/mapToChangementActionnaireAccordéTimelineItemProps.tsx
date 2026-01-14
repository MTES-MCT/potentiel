import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementActionnaireAccordéTimelineItemProps = (
  event: Lauréat.Actionnaire.ChangementActionnaireAccordéEvent,
): TimelineItemProps => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
    nouvelActionnaire,
  } = event.payload;

  return {
    date: accordéLe,
    title: "Demande de changement d'actionnaire accordée",
    actor: accordéPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Actionnaire.TypeDocumentActionnaire.changementAccordé.formatter(),
        accordéLe,
        format,
      ),
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la demande de changement d'actionnaire accordée le ${formatDateToText(accordéLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel actionnaire : <span className="font-semibold">{nouvelActionnaire}</span>
        </div>
      </div>
    ),
  };
};
