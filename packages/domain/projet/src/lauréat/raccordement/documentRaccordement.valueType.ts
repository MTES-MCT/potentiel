import { join } from 'node:path';

import { DocumentProjet, DossierProjet } from '#document-projet';
import { TypeDocumentsRaccordement } from './index.js';

const domaine = 'raccordement';

const typeAccuséRéception = 'accusé-réception';

export const dossierProjetRaccordement = (identifiantProjet: string, référence: string) => {
  return {
    accuséRéception: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(/*turbopackIgnore: true*/ domaine, référence, typeAccuséRéception),
    }),
    propositionTechniqueEtFinancière: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(
        /*turbopackIgnore: true*/ domaine,
        référence,
        TypeDocumentsRaccordement.propositionTechniqueEtFinancière.type,
      ),
    }),
    conventionDeRaccordement: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(
        /*turbopackIgnore: true*/ domaine,
        référence,
        TypeDocumentsRaccordement.conventionDeRaccordement.type,
      ),
    }),
    conventionDirecteDeRaccordement: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(
        /*turbopackIgnore: true*/ domaine,
        référence,
        TypeDocumentsRaccordement.conventionDirecteDeRaccordement.type,
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

// Juste pour gagner du temps sur le seed
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
