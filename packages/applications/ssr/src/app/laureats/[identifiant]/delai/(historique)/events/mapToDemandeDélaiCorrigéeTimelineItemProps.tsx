import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';
import { getMotifDemandeDélaiLabel } from '../../_helpers/getMotifDemandeDélaiLabel';

export const mapToDemandeDélaiCorrigéeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiCorrigéeEvent | Lauréat.Délai.DemandeDélaiCorrigéeEventV1,
): TimelineItemProps => {
  const {
    identifiantProjet,
    dateDemande,
    corrigéeLe,
    corrigéePar,
    pièceJustificative,
    nombreDeMois,
    raison,
  } = event.payload;

  const motifLabel = getMotifDemandeDélaiLabel(
    event.type === 'DemandeDélaiCorrigée-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.motif
      : event.payload.motif,
  );

  return {
    date: corrigéeLe,
    title: 'Demande de délai corrigée',
    actor: corrigéePar,
    file: pièceJustificative && {
      document: Lauréat.Délai.DocumentDélai.pièceJustificative({
        identifiantProjet,
        demandéLe: dateDemande,
        pièceJustificative,
      }),
      ariaLabel: `Télécharger le justificatif de la demande de délai corrigée le ${formatDateToText(corrigéeLe)}`,
    },
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
