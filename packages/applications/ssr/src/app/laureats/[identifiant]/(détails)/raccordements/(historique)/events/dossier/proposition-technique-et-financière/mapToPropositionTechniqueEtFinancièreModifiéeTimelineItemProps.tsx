import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToPropositionTechniqueEtFinancièreModifiéeTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV1
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV2
    | Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEvent
  ) & { createdAt: string },
): TimelineItemProps => {
  const { référenceDossierRaccordement, identifiantProjet } = event.payload;
  const modifiéeLe: DateTime.RawType =
    'modifiéeLe' in event.payload
      ? event.payload.modifiéeLe
      : DateTime.convertirEnValueType(event.createdAt).formatter();

  const modifiéePar: string | undefined =
    'modifiéePar' in event.payload ? event.payload.modifiéePar : undefined;

  const dateSignature: string | undefined =
    'dateSignature' in event.payload ? event.payload.dateSignature : undefined;

  const propositionTechniqueEtFinancièreSignée: { format: string } | undefined =
    'propositionTechniqueEtFinancièreSignée' in event.payload
      ? event.payload.propositionTechniqueEtFinancièreSignée
      : undefined;

  return {
    date: modifiéeLe,
    actor: modifiéePar,
    title: 'Proposition technique et financière modifiée',
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
