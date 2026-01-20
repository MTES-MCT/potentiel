import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToInstallateurModifiéTimelineItemsProps = (
  event: Lauréat.Installation.InstallateurModifiéEvent,
): TimelineItemProps => {
  const { modifiéLe, modifiéPar, installateur, raison, pièceJustificative, identifiantProjet } =
    event.payload;

  return {
    date: modifiéLe,
    title: 'Installateur modifié',
    actor: modifiéPar,
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Installation.TypeDocumentInstallateur.pièceJustificative.formatter(),
        modifiéLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif du changement d'installateur en date du ${formatDateToText(modifiéLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel installateur : <span className="font-semibold">{installateur}</span>
        </div>
      </div>
    ),
    reason: raison,
  };
};
