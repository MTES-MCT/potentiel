import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

import { DétailsDispositifDeStockage } from '../../dispositif-de-stockage/DétailsDispositifDeStockage';

export const mapToDispositifDeStockageEnregistréTimelineItemsProps = ({
  payload: {
    dispositifDeStockage,
    raison,
    pièceJustificative,
    identifiantProjet,
    enregistréLe,
    enregistréPar,
  },
}: Lauréat.Installation.ChangementDispositifDeStockageEnregistréEvent): TimelineItemProps => ({
  date: enregistréLe,
  actor: enregistréPar,
  title: 'Dispositif de stockage modifié',
  file: pièceJustificative
    ? {
        document: Lauréat.Installation.DocumentDispositifDeStockage.pièceJustificative({
          identifiantProjet,
          enregistréLe,
          pièceJustificative: {
            format: pièceJustificative.format,
          },
        }),
        ariaLabel: `Télécharger le justificatif du changement de dispositif de stockage enregistré le ${formatDateToText(enregistréLe)}`,
      }
    : undefined,
  details: (
    <div className="flex flex-col gap-2">
      <DétailsDispositifDeStockage dispositifDeStockage={dispositifDeStockage} />
    </div>
  ),
  reason: raison,
  link: {
    url: Routes.Installation.changement.dispositifDeStockage.détails(
      identifiantProjet,
      enregistréLe,
    ),
    label: 'Détail du changement',
    ariaLabel: `Voir le détail du changement de dispositif de stockage enregistré le ${formatDateToText(enregistréLe)}`,
  },
});
