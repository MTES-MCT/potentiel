import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToPropositionTechniqueEtFinancièreModifiéeTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV1
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV2
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEvent
  ) & {
    createdAt: string;
  },
): TimelineItemProps => {
  const modifiéeLe: DateTime.RawType =
    'modifiéeLe' in event.payload
      ? event.payload.modifiéeLe
      : DateTime.convertirEnValueType(event.createdAt).formatter();

  const modifiéePar: string | undefined =
    'modifiéePar' in event.payload ? event.payload.modifiéePar : undefined;
  return {
    date: modifiéeLe,
    actor: modifiéePar,
    title: (
      <>
        La proposition technique et financière du dossier de raccordement{' '}
        <span className="font-semibold">{event.payload.référenceDossierRaccordement}</span> a été
        modifiée
      </>
    ),
  };
};
