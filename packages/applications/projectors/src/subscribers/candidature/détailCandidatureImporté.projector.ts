import { type Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { applyTemplateToPayload } from './_helpers/applyTemplateToPayload.js';
import { mapDNDétailToDétailFournisseur } from './_helpers/mapDNDétailToDétailFournisseur.js';
import { mapDétailToDétailFournisseur } from './_helpers/mapDétailToDétailFournisseur.js';
import { getTemplateDétailCandidatureVérifié } from './_helpers/templatesVérificationDétailCandidature.js';

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

  const template = getTemplateDétailCandidatureVérifié(
    appelOffre,
    détail.typeImport === 'démarches-simplifiées',
  );

  const détailVérifié: Candidature.DétailCandidatureVérifiéEntity['détail'] =
    applyTemplateToPayload<Candidature.DétailCandidatureVérifiéEntity['détail']>(détail, template);

  await upsertProjection<Candidature.DétailCandidatureVérifiéEntity>(
    `détail-candidature-vérifié|${identifiantProjet}`,
    {
      identifiantProjet,
      détail: détailVérifié,
    },
  );
};
