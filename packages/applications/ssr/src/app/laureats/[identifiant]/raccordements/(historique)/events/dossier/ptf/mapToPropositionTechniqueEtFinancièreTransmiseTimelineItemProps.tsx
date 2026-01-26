import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToPropositionTechniqueEtFinancièreTransmiseTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreSignéeTransmiseEventV1
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV1
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV2
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEvent
  ) & { createdAt: string },
): TimelineItemProps => {
  const référenceDossierRaccordement = event.payload.référenceDossierRaccordement;
  const transmiseLe: DateTime.RawType =
    'transmiseLe' in event.payload
      ? event.payload.transmiseLe
      : DateTime.convertirEnValueType(event.createdAt).formatter();

  const transmisePar: string | undefined =
    'transmisePar' in event.payload ? event.payload.transmisePar : undefined;

  const signéeLe: DateTime.RawType | undefined =
    'dateSignature' in event.payload ? event.payload.dateSignature : undefined;
  const signéeLeText = signéeLe ? `, signée le ${formatDateToText(signéeLe)}, ` : '';

  return {
    date: transmiseLe,
    actor: transmisePar,
    title: (
      <>
        La proposition technique et financière{signéeLeText} a été transmise pour le dossier de
        raccordement <span className="font-semibold">{référenceDossierRaccordement}</span>
      </>
    ),
  };
};
