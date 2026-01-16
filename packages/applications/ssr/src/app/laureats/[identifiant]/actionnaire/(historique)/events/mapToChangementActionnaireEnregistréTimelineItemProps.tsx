import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementActionnaireEnregistréTimelineItemProps = (
  event: Lauréat.Actionnaire.ChangementActionnaireEnregistréEvent,
): TimelineItemProps => {
  const {
    enregistréLe,
    enregistréPar,
    identifiantProjet,
    pièceJustificative,
    actionnaire,
    raison,
  } = event.payload;
  return {
    date: enregistréLe,
    title: 'Actionnaire modifié',
    actor: enregistréPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
        enregistréLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif du changement d'actionnaire en date du ${formatDateToText(enregistréLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel actionnaire : <span className="font-semibold">{actionnaire}</span>
        </div>
      </div>
    ),
    reason: raison,
  };
};
