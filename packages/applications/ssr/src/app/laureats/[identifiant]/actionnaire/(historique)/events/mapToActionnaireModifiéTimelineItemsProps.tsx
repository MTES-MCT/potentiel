import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToActionnaireModifiéTimelineItemProps = (
  event: Lauréat.Actionnaire.ActionnaireModifiéEvent,
): TimelineItemProps => {
  const { modifiéLe, modifiéPar, identifiantProjet, pièceJustificative, actionnaire, raison } =
    event.payload;

  return {
    date: modifiéLe,
    title: 'Actionnaire modifié',
    actor: modifiéPar,
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
        modifiéLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif de la modification d'actionnaire enregistrée le ${formatDateToText(modifiéLe)}`,
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
