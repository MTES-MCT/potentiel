import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToTypeDocumentModifiéTimelineItemProps = (
  event: Lauréat.Raccordement.TypeDocumentRaccordementModifiéEventV1,
): TimelineItemProps => {
  const {
    ancienType: rawAncienType,
    nouveauType: rawNouveauType,
    référenceDossierRaccordement,
    modifiéLe,
    modifiéPar,
  } = event.payload;

  const ancienType = rawAncienType.split('-').join(' ');
  const nouveauType = rawNouveauType.split('-').join(' ');

  return {
    date: DateTime.convertirEnValueType(modifiéLe).formatter(),
    actor: modifiéPar,
    title: (
      <>
        <span className="first-letter:capitalize">{ancienType}</span> modifiée vers une{' '}
        <span className="first-letter:capitalize">{nouveauType}</span>
      </>
    ),
    details: (
      <span>
        Référence du dossier : <span className="font-semibold">{référenceDossierRaccordement}</span>
      </span>
    ),
  };
};
