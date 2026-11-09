import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToPropositionTechniqueEtFinancièreTransmiseTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreSignéeTransmiseEventV1
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV1
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV2
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEvent
  ) & { createdAt: string },
): TimelineItemProps => {
  const { référenceDossierRaccordement, identifiantProjet } = event.payload;
  const transmiseLe: DateTime.RawType =
    'transmiseLe' in event.payload
      ? event.payload.transmiseLe
      : DateTime.convertirEnValueType(event.createdAt).formatter();

  const transmisePar: string | undefined =
    'transmisePar' in event.payload ? event.payload.transmisePar : undefined;

  const dateSignature: string | undefined =
    'dateSignature' in event.payload ? event.payload.dateSignature : undefined;

  const propositionTechniqueEtFinancièreSignée: { format: string } | undefined =
    'propositionTechniqueEtFinancièreSignée' in event.payload
      ? event.payload.propositionTechniqueEtFinancièreSignée
      : undefined;

  return {
    date: transmiseLe,
    actor: transmisePar,
    title: 'Proposition technique et financière transmise',
    details: (
      <span>
        Référence du dossier : <span className="font-semibold">{référenceDossierRaccordement}</span>
      </span>
    ),
    file:
      dateSignature && propositionTechniqueEtFinancièreSignée
        ? {
            document: Lauréat.Raccordement.DocumentRaccordement.propositionTechniqueEtFinancière({
              identifiantProjet,
              référenceDossierRaccordement,
              dateSignature,
              propositionTechniqueEtFinancièreSignée,
            }),
            label: `Télécharger la proposition technique et financière`,
            ariaLabel: `Télécharger la proposition technique et financière du dossier ${référenceDossierRaccordement}`,
          }
        : undefined,
  };
};
