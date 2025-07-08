import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export const mapToPropositionTechniqueEtFinancièreTransmiseTimelineItemProps = (
  readmodel: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const event:
    | {
        date: DateTime.RawType;
        référenceDossierRaccordement: string;
      }
    | undefined = match(readmodel)
    .with({ type: 'PropositionTechniqueEtFinancièreSignéeTransmise-V1' }, (event) => {
      const { référenceDossierRaccordement } =
        event.payload as Lauréat.Raccordement.PropositionTechniqueEtFinancièreSignéeTransmiseEventV1['payload'];

      return {
        date: DateTime.convertirEnValueType(event.createdAt).formatter(),
        référenceDossierRaccordement,
      };
    })
    .with({ type: 'PropositionTechniqueEtFinancièreTransmise-V1' }, (event) => {
      const { référenceDossierRaccordement, dateSignature } =
        event.payload as Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV1['payload'];

      return {
        date: dateSignature,
        référenceDossierRaccordement,
      };
    })
    .with({ type: 'PropositionTechniqueEtFinancièreTransmise-V2' }, (event) => {
      const { référenceDossierRaccordement, dateSignature } =
        event.payload as Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEvent['payload'];

      return {
        date: dateSignature,
        référenceDossierRaccordement,
      };
    })
    .otherwise(() => undefined);

  if (!event) {
    return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(readmodel);
  }

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
