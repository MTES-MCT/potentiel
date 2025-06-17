import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/laureat';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { MapToRaccordementTimelineItemProps } from '../../../mapToRaccordementTimelineItemProps';

export const mapToPropositionTechniqueEtFinancièreTransmiseTimelineItemProps: MapToRaccordementTimelineItemProps =
  (modification, icon) => {
    const event = match(modification)
      .with(
        { type: 'PropositionTechniqueEtFinancièreSignéeTransmise-V1' },
        (event) =>
          event as unknown as Raccordement.PropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
      )
      .with(
        { type: 'PropositionTechniqueEtFinancièreTransmise-V1' },
        (event) =>
          event as unknown as Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV1,
      )
      .with(
        { type: 'PropositionTechniqueEtFinancièreTransmise-V2' },
        (event) => event as unknown as Raccordement.PropositionTechniqueEtFinancièreTransmiseEvent,
      )
      .otherwise(() => undefined);

    if (!event) {
      return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(modification);
    }

    return {
      date: modification.createdAt as DateTime.RawType,
      icon,
      title: (
        <div>
          La proposition technique et financière a été transmise pour le dossier de raccordement{' '}
          <span className="font-semibold">{event.payload.référenceDossierRaccordement}</span>.
        </div>
      ),
    };
  };
