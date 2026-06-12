import { type Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { applyTemplateToPayload } from './_helpers/applyTemplateToPayload.js';
import { mapDNDétailToDétailFournisseur } from './_helpers/mapDNDétailToDétailFournisseur.js';
import { mapDétailToDétailFournisseur } from './_helpers/mapDétailToDétailFournisseur.js';
import {
  commonTemplate,
  templateCRE4EolienDétailCsv,
  templatePPE2EolienDétailCsv,
  templatePPE2EolienDétailDn,
  templatePPE2SolDétailDn,
} from './_helpers/templatesVérificationDétailCandidature.js';

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

  const getTemplate = (appelOffre: string, importDn: boolean) => {
    if (appelOffre === 'Eolien') {
      return templateCRE4EolienDétailCsv;
    }

    if (appelOffre === 'PPE2 - Eolien') {
      return importDn ? templatePPE2EolienDétailDn : templatePPE2EolienDétailCsv;
    }

    if (appelOffre === 'PPE2 - Sol' && importDn) {
      return templatePPE2SolDétailDn;
    }

    return commonTemplate;
  };

  const template = getTemplate(appelOffre, détail.typeImport === 'démarches-simplifiées');

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
