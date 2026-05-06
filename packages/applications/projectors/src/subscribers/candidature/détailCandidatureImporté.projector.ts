import { Candidature } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { mapDétailToDétailFournisseur } from './_helpers/mapDétailToDétailFournisseur.js';

export const détailCandidatureImportéProjector = async ({
  payload: { identifiantProjet, détail },
}: Candidature.DétailCandidatureImportéEvent) => {
  await upsertProjection<Candidature.DétailCandidatureEntity>(
    `détail-candidature|${identifiantProjet}`,
    {
      identifiantProjet,
      détail,
    },
  );

  const détailFournisseurs = mapDétailToDétailFournisseur(détail);
  await upsertProjection<Candidature.DétailFournisseursCandidatureEntity>(
    `détail-fournisseurs-candidature|${identifiantProjet}`,
    {
      identifiantProjet,
      fournisseurs: détailFournisseurs,
    },
  );
};
