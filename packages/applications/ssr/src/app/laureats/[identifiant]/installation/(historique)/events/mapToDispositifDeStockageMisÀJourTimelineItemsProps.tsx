import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
import { formatDateToText } from '@/app/_helpers';

import { DétailsDispositifDeStockage } from '../../dispositif-de-stockage/DétailsDispositifDeStockage';

export const mapToDispositifDeStockageMisÀJourTimelineItemsProps = (
  event:
    | Lauréat.Installation.DispositifDeStockageModifiéEvent
    | Lauréat.Installation.ChangementDispositifDeStockageEnregistréEvent,
): TimelineItemProps => {
  const { dispositifDeStockage, raison, pièceJustificative, identifiantProjet } = event.payload;
  const date =
    event.type === 'ChangementDispositifDeStockageEnregistré-V1'
      ? event.payload.enregistréLe
      : event.payload.modifiéLe;

  return {
    date,
    actor:
      event.type === 'ChangementDispositifDeStockageEnregistré-V1'
        ? event.payload.enregistréPar
        : event.payload.modifiéPar,
    title: 'Dispositif de stockage modifié',
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Installation.TypeDocumentDispositifDeStockage.pièceJustificative.formatter(),
        date,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif joint au changement de dispositif de stockage enregistré le ${formatDateToText(date)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <DétailsDispositifDeStockage dispositifDeStockage={dispositifDeStockage} />
        <DisplayRaisonChangement raison={raison} />
      </div>
    ),
  };
};
