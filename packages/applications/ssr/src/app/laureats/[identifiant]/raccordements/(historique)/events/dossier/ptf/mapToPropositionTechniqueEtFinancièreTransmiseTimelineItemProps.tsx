import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToPropositionTechniqueEtFinancièreTransmiseTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreSignéeTransmiseEventV1
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV1
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEvent
  ) & { createdAt: string },
): TimelineItemProps => {
  const { date, référenceDossierRaccordement } = match(event)
    .with({ type: 'PropositionTechniqueEtFinancièreSignéeTransmise-V1' }, (event) => {
      const { référenceDossierRaccordement } = event.payload;

      return {
        date: DateTime.convertirEnValueType(event.createdAt).formatter(),
        référenceDossierRaccordement,
      };
    })
    .otherwise((event) => {
      const { référenceDossierRaccordement, dateSignature } = event.payload;

      return {
        date: dateSignature,
        référenceDossierRaccordement,
      };
    });

  return {
    date,
    title: (
      <>
        La proposition technique et financière a été transmise pour le dossier de raccordement{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span>
      </>
    ),
  };
};
