import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';
import { getMotifDemandeDélaiLabel } from '../../_helpers/getMotifDemandeDélaiLabel';

export const mapToDélaiDemandéTimelineItemProps = (
  event: Lauréat.Délai.DélaiDemandéEvent | Lauréat.Délai.DélaiDemandéEventV1,
  permissionConsulterChangement: boolean,
): TimelineItemProps => {
  const { identifiantProjet, demandéLe, demandéPar, pièceJustificative, nombreDeMois, raison } =
    event.payload;

  const motifLabel = getMotifDemandeDélaiLabel(
    event.type === 'DélaiDemandé-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.motif
      : event.payload.motif,
  );

  return {
    date: demandéLe,
    title: 'Délai demandé',
    actor: demandéPar,
    file: pièceJustificative && {
      document: Lauréat.Délai.DocumentDélai.pièceJustificative(event.payload),
      ariaLabel: `Télécharger le justificatif de la demande de ${motifLabel.toLowerCase()} en date du ${formatDateToText(demandéLe)}`,
    },
    link: permissionConsulterChangement
      ? {
          url: Routes.Délai.détail(identifiantProjet, demandéLe),
          ariaLabel: `Voir le détail de la demande de ${motifLabel} en date du ${formatDateToText(demandéLe)}`,
          label: 'Détail de la demande',
        }
      : undefined,
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Durée : <span className="font-semibold">{nombreDeMois} mois</span>
        </div>
        <div>
          Motif : <span className="font-semibold">{motifLabel.toLowerCase()}</span>
        </div>
      </div>
    ),
    reason: raison,
  };
};
