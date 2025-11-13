import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const demandeComplèteRaccordementModifiéeV1Projector = async ({
  payload: { identifiantProjet, referenceActuelle, nouvelleReference, dateQualification },
  created_at,
}: Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV1 & Event) => {
  const dossier = await findProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${referenceActuelle}`,
  );

  if (Option.isNone(dossier)) {
    throw new Error('Dossier non trouvé');
  }

  await removeProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${referenceActuelle}`,
  );

  await upsertProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${nouvelleReference}`,
    {
      identifiantProjet,
      identifiantGestionnaireRéseau: dossier.identifiantGestionnaireRéseau,
      référence: nouvelleReference,
      demandeComplèteRaccordement: {
        dateQualification,
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );
};
