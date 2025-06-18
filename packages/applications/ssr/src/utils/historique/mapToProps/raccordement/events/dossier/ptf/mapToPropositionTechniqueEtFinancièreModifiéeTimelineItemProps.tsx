import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';
import { Raccordement } from '@potentiel-domain/projet';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export const mapToPropositionTechniqueEtFinancièreModifiéeTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const event = match(modification)
    .with(
      { type: 'PropositionTechniqueEtFinancièreSignéeTransmise-V1' },
      (event) => event as unknown as Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV1,
    )
    .with(
      { type: 'PropositionTechniqueEtFinancièreTransmise-V2' },
      (event) => event as unknown as Raccordement.PropositionTechniqueEtFinancièreModifiéeEvent,
    )
    .otherwise(() => undefined);

  if (!event) {
    return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(modification);
  }

  return {
    date: modification.createdAt as DateTime.RawType,
    title: (
      <div>
        La proposition technique et financière a été modifiée pour le dossier de raccordement
        <span className="font-semibold">{event.payload.référenceDossierRaccordement}</span>.
      </div>
    ),
  };
};
