import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

import { DétailsDispositifDeStockage } from '../../dispositif-de-stockage/DétailsDispositifDeStockage';

export const mapToDispositifDeStockageModifiéTimelineItemsProps = ({
  payload: {
    dispositifDeStockage,
    raison,
    pièceJustificative,
    identifiantProjet,
    modifiéLe,
    modifiéPar,
  },
}: Lauréat.Installation.DispositifDeStockageModifiéEvent): TimelineItemProps => ({
  date: modifiéLe,
  actor: modifiéPar,

  title: 'Dispositif de stockage modifié',
  file: pièceJustificative
    ? {
        document: Lauréat.Installation.DocumentDispositifDeStockage.pièceJustificativeModification({
          identifiantProjet,
          modifiéLe,
          pièceJustificative: {
            format: pièceJustificative.format,
          },
        }),
        ariaLabel: `Télécharger le justificatif du changement de dispositif de stockage modifié le ${formatDateToText(modifiéLe)}`,
      }
    : undefined,
  details: (
    <div className="flex flex-col gap-2">
      <DétailsDispositifDeStockage dispositifDeStockage={dispositifDeStockage} />
    </div>
  ),
  reason: raison,
});
