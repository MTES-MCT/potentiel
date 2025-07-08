import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToPropositionTechniqueEtFinancièreModifiéeTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV1
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEvent
  ) & {
    createdAt: string;
  },
) => {
  return {
    date: event.createdAt as DateTime.RawType,
    title: (
      <div>
        La proposition technique et financière a été modifiée pour le dossier de raccordement
        <span className="font-semibold">{event.payload.référenceDossierRaccordement}</span>
      </div>
    ),
  };
};
