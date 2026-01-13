import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
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
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Installation.TypeDocumentTypologieInstallation.pièceJustificative.formatter(),
        modifiéeLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif joint au changement de typologie du projet enregistré le ${formatDateToText(modifiéeLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>Nouvelle typologie du projet :</div>
        <DétailTypologieInstallation typologieInstallation={typologieInstallation} />
        <DisplayRaisonChangement raison={raison} />
      </div>
    ),
  };
};
