import { join } from 'node:path';

import { DocumentProjet, DossierProjet } from '#document-projet';
import { TypeDocumentsRaccordement } from '../index.js';

const domaine = 'raccordement';

const typeAccuséRéception = 'accusé-réception';

// replacement de caractères problématiques dans les URLs
const sanitizeRéférenceForS3 = (reference: string): string =>
  reference.replaceAll(/['?*:;{}/\\]/g, '_');

export const test = (identifiantProjet: string, référence: string) => {
  return DossierProjet.convertirEnValueType({
    identifiantProjet,
    typeDocument: join(/*turbopackIgnore: true*/ domaine, sanitizeRéférenceForS3(référence)),
  });
};

export const dossierProjetRaccordement = (identifiantProjet: string, référence: string) => {
  return {
    accuséRéception: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(
        /*turbopackIgnore: true*/ domaine,
        sanitizeRéférenceForS3(référence),
        typeAccuséRéception,
      ),
    }),
    propositionTechniqueEtFinancière: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(
        /*turbopackIgnore: true*/ domaine,
        sanitizeRéférenceForS3(référence),
        TypeDocumentsRaccordement.propositionTechniqueEtFinancière.type,
      ),
    }),
    conventionDeRaccordement: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(
        /*turbopackIgnore: true*/ domaine,
        sanitizeRéférenceForS3(référence),
        TypeDocumentsRaccordement.conventionDeRaccordement.type,
      ),
    }),
    conventionDeRaccordementDirecte: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(
        /*turbopackIgnore: true*/ domaine,
        sanitizeRéférenceForS3(référence),
        TypeDocumentsRaccordement.conventionDeRaccordementDirecte.type,
      ),
    }),
  };
};

export const accuséRéception = DocumentProjet.documentFactory({
  domaine,
  nomCléDocument: 'référenceDossierRaccordement',
  typeDocument: typeAccuséRéception,
  nomChampDocument: 'accuséRéception',
  nomChampDate: 'dateQualification',
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

export const documentRaccordement = (type: TypeDocumentsRaccordement.RawType) =>
  DocumentProjet.documentFactory({
    domaine,
    nomCléDocument: 'référenceDossierRaccordement',
    typeDocument: type,
    nomChampDate: 'dateSignature',
    nomChampDocument: 'document',
  });
