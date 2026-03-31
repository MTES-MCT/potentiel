import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

import { DétailTypologieInstallation } from './DétailTypologieInstallation';

export const mapToTypologieInstallationModifiéeTimelineItemsProps = (
  event: Lauréat.Installation.TypologieInstallationModifiéeEvent,
): TimelineItemProps => {
  const {
    modifiéeLe,
    modifiéePar,
    typologieInstallation,
    raison,
    pièceJustificative,
    identifiantProjet,
  } = event.payload;

  return {
    date: modifiéeLe,
    title: 'Typologie du projet modifiée',
    actor: modifiéePar,
    file: pièceJustificative && {
      document: Lauréat.Installation.DocumentTypologieInstallation.pièceJustificative({
        identifiantProjet,
        enregistréLe: modifiéeLe,
        pièceJustificative,
      }),
      ariaLabel: `Télécharger le justificatif de la modification de typologie du projet en date du ${formatDateToText(modifiéeLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>Nouvelle typologie du projet :</div>
        <DétailTypologieInstallation typologieInstallation={typologieInstallation} />
      </div>
    ),
    reason: raison,
  };
};
