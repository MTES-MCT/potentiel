import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToPropositionTechniqueEtFinancièreTransmiseTimelineItemProps = (
  readmodel: (
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreSignéeTransmiseEventV1
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV1
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEvent
  ) & { createdAt: string },
) => {
  const event:
    | {
        date: DateTime.RawType;
        référenceDossierRaccordement: string;
      }
    | undefined = match(readmodel)
    .with({ type: 'PropositionTechniqueEtFinancièreSignéeTransmise-V1' }, (event) => {
      const { référenceDossierRaccordement } = event.payload;

      return {
        date: DateTime.convertirEnValueType(event.createdAt).formatter(),
        référenceDossierRaccordement,
      };
    })
    .with({ type: 'PropositionTechniqueEtFinancièreTransmise-V1' }, (event) => {
      const { référenceDossierRaccordement, dateSignature } = event.payload;

      return {
        date: dateSignature,
        référenceDossierRaccordement,
      };
    })
    .with({ type: 'PropositionTechniqueEtFinancièreTransmise-V2' }, (event) => {
      const { référenceDossierRaccordement, dateSignature } = event.payload;

      return {
        date: dateSignature,
        référenceDossierRaccordement,
      };
    })
    .exhaustive();

  const { date, référenceDossierRaccordement } = event;

  return {
    date,
    title: (
      <div>
        La proposition technique et financière a été transmise pour le dossier de raccordement{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span>
      </div>
    ),
  };
};
