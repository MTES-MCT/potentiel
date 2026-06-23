import { join } from 'node:path';

import { DocumentProjet, DossierProjet } from '#document-projet';
import { TypeDocumentConventionRaccordement } from './index.js';

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
        TypeDocumentConventionRaccordement.propositionTechniqueEtFinancière.type,
      ),
    }),
    conventionDeRaccordemet: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(
        /*turbopackIgnore: true*/ domaine,
        référence,
        TypeDocumentConventionRaccordement.conventionDeRaccordement.type,
      ),
    }),
    conventionDirecteDeRaccordement: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(
        /*turbopackIgnore: true*/ domaine,
        référence,
        TypeDocumentConventionRaccordement.conventionDirecteDeRaccordement.type,
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

export const propositionTechniqueEtFinancière = DocumentProjet.documentFactory({
  domaine,
  nomCléDocument: 'référenceDossierRaccordement',
  typeDocument: TypeDocumentConventionRaccordement.propositionTechniqueEtFinancière.type,
  nomChampDocument: 'propositionTechniqueEtFinancièreSignée',
  nomChampDate: 'dateSignature',
});

export const conventionDeRaccordement = DocumentProjet.documentFactory({
  domaine,
  nomCléDocument: 'référenceDossierRaccordement',
  typeDocument: TypeDocumentConventionRaccordement.conventionDeRaccordement.type,
  nomChampDocument: 'conventionDeRaccordement',
  nomChampDate: 'dateSignature',
});

export const conventionDirecteDeRaccordement = DocumentProjet.documentFactory({
  domaine,
  nomCléDocument: 'référenceDossierRaccordement',
  typeDocument: TypeDocumentConventionRaccordement.conventionDirecteDeRaccordement.type,
  nomChampDocument: 'conventionDirecteDeRaccordement',
  nomChampDate: 'dateSignature',
});
