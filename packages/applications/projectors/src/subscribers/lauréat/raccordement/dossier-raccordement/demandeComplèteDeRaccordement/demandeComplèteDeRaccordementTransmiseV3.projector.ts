import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getRaccordement } from '../../_utils/getRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const demandeComplèteDeRaccordementTransmiseV3Projector = async ({
  payload: {
    identifiantProjet,
    identifiantGestionnaireRéseau,
    référenceDossierRaccordement,
    dateQualification,
    accuséRéception,
    transmiseLe,
    transmisePar,
  },
  created_at,
}: Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEvent & Event) => {
  const référence = référenceDossierRaccordement;

  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet}`,
  );
  const raccordement = await getRaccordement(identifiantProjet);

  const projetNotifiéLe = Option.match(candidature)
    .some((candidature) =>
      candidature.estNotifiée ? candidature.notification.notifiéeLe : undefined,
    )
    .none(() => undefined);

  await upsertDossierRaccordement({
    identifiantProjet,
    raccordement,
    dossierRaccordement: {
      identifiantProjet,
      identifiantGestionnaireRéseau,
      référence,
      demandeComplèteRaccordement: {
        dateQualification,
        accuséRéception: accuséRéception
          ? {
              format: accuséRéception.format,
            }
          : undefined,
        transmiseLe,
        transmisePar,
      },
      projetNotifiéLe,
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });

  if (raccordement.identifiantGestionnaireRéseau !== identifiantGestionnaireRéseau) {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      { identifiantGestionnaireRéseau },
    );
  }
};
