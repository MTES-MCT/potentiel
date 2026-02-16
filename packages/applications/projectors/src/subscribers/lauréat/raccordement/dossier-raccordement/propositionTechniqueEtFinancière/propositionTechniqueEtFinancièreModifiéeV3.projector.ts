import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const propositionTechniqueEtFinancièreModifiéeV3Projector = async ({
  payload: {
    identifiantProjet,
    référenceDossierRaccordement,
    dateSignature,
    propositionTechniqueEtFinancièreSignée: { format },
    modifiéeLe,
  },
}: Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEvent) => {
  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      propositionTechniqueEtFinancière: {
        dateSignature,
        propositionTechniqueEtFinancièreSignée: {
          format,
        },
      },
      miseÀJourLe: DateTime.convertirEnValueType(modifiéeLe).formatter(),
    },
  );
};
