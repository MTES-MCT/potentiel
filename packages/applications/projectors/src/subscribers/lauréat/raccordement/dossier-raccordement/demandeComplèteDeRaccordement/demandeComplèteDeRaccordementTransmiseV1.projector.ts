import { DateTime } from '@potentiel-domain/common';
import type { Candidature, Lauréat } from '@potentiel-domain/projet';
import type { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

import { getRaccordement } from '../../_utils/getRaccordement';
import type { DossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const demandeComplèteDeRaccordementTransmiseV1Projector = async ({
  payload: {
    identifiantProjet,
    identifiantGestionnaireRéseau,
    référenceDossierRaccordement,
    dateQualification,
  },
  created_at,
}: Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEventV1 & Event) => {
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
  const dossier: DossierRaccordement = {
    identifiantProjet,
    identifiantGestionnaireRéseau,
    référence,
    demandeComplèteRaccordement: {
      dateQualification,
    },
    projetNotifiéLe,
    misÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
  };

  await upsertProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
    {
      ...raccordement,
      identifiantGestionnaireRéseau,
      dossiers: [dossier, ...raccordement.dossiers],
    },
  );

  await upsertProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    dossier,
  );
};
