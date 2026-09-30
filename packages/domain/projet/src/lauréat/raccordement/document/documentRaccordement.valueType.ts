import { join } from 'node:path';

import { DocumentProjet, DossierProjet } from '#document-projet';
import type { TypeDocumentsRaccordement } from '../index.js';

const domaine = 'raccordement';

export const dossierProjetRaccordement = (identifiantProjet: string, référence: string) => {
  return DossierProjet.convertirEnValueType({
    identifiantProjet,
    typeDocument: join(
      /*turbopackIgnore: true*/ domaine,
      DocumentProjet.sanitizeCléDocumentForS3(référence),
    ),
  });
};

export const accuséRéception = DocumentProjet.documentFactory({
  domaine,
  nomCléDocument: 'référenceDossierRaccordement',
  typeDocument: 'accusé-réception',
  nomChampDocument: 'accuséRéception',
  nomChampDate: 'dateQualification',
});

export const documentRaccordement = (type: TypeDocumentsRaccordement.RawType) =>
  DocumentProjet.documentFactory({
    domaine,
    nomCléDocument: 'référenceDossierRaccordement',
    typeDocument: type,
    nomChampDate: 'dateSignature',
    nomChampDocument: 'document',
  });

/**
 *
 * @deprecated Pour gérer la rétrocompatibilité avec les événement "PTF" dans le seed
 */
export const propositionTechniqueEtFinancière = DocumentProjet.documentFactory({
  domaine,
  nomCléDocument: 'référenceDossierRaccordement',
  typeDocument: 'proposition-technique-et-financière',
  nomChampDate: 'dateSignature',
  nomChampDocument: 'propositionTechniqueEtFinancièreSignée',
});
