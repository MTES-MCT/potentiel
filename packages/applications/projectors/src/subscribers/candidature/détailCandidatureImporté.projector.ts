import { type Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { applyTemplateToPayload } from './_helpers/applyTemplateToPayload.js';
import { mapDNDétailToDétailFournisseur } from './_helpers/mapDNDétailToDétailFournisseur.js';
import { mapDétailToDétailFournisseur } from './_helpers/mapDétailToDétailFournisseur.js';
import { templateVérificationDétailCandidature } from './_helpers/templatesVérificationDétailCandidature.js';

export const détailCandidatureImportéProjector = async ({
  payload: { identifiantProjet, détail },
}: Candidature.DétailCandidatureImportéEvent) => {
  const fournisseurs =
    détail.typeImport === 'démarches-simplifiées'
      ? mapDNDétailToDétailFournisseur(détail)
      : mapDétailToDétailFournisseur(détail);

  await upsertProjection<Candidature.DétailFournisseursCandidatureEntity>(
    `détail-fournisseurs-candidature|${identifiantProjet}`,
    {
      identifiantProjet,
      fournisseurs,
    },
  );

  const { appelOffre } = IdentifiantProjet.convertirEnValueType(identifiantProjet);

  const détailVérifié: Candidature.DétailsCandidature =
    applyTemplateToPayload<Candidature.DétailsCandidature>(
      détail,
      templateVérificationDétailCandidature,
      {
        appelOffre,
        typeImport: détail.typeImport === 'démarches-simplifiées' ? 'démarche-simplifiée' : 'csv',
      },
    );

  await upsertProjection<Candidature.DétailCandidatureEntity>(
    `détail-candidature|${identifiantProjet}`,
    {
      identifiantProjet,
      ...détailVérifié,
    },
  );
};
