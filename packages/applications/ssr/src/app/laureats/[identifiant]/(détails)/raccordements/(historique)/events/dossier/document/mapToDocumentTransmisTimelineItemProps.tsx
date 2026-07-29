import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDocumentTransmisTimelineItemProps = (
  event: Lauréat.Raccordement.DocumentRaccordementTransmisEventV1,
): TimelineItemProps => {
  const {
    identifiantProjet,
    type: rawType,
    référenceDossierRaccordement,
    transmisLe,
    transmisPar,
    dateSignature,
    document,
  } = event.payload;

  const type = rawType.split('-').join(' ');

  return {
    date: DateTime.convertirEnValueType(transmisLe).formatter(),
    actor: transmisPar,
    title: (
      <>
        <span className="first-letter:capitalize">{type}</span> transmise
      </>
    ),
    details: (
      <span>
        Référence du dossier : <span className="font-semibold">{référenceDossierRaccordement}</span>
      </span>
    ),
    file: {
      document: Lauréat.Raccordement.DocumentRaccordement.documentRaccordement(rawType)({
        identifiantProjet,
        référenceDossierRaccordement,
        dateSignature,
        document,
      }),
      label: `Télécharger la ${type}`,
      ariaLabel: `Télécharger la ${type} du dossier ${référenceDossierRaccordement}`,
    },
  };
};
