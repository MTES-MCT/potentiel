import { join } from 'node:path';

import { match } from 'ts-pattern';

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

// viovio : vérifier si ça fonctionne bien
export const documentRaccordement = (type: TypeDocumentsRaccordement.RawType) => {
  const commonPayload = {
    domaine,
    nomCléDocument: 'référenceDossierRaccordement',
    typeDocument: type,
    nomChampDate: 'dateSignature',
  };

  return match(type)
    .with('proposition-technique-et-financière', () =>
      DocumentProjet.documentFactory({
        ...commonPayload,
        nomChampDocument: 'propositionTechniqueEtFinancièreSignée',
      }),
    )
    .with('convention-de-raccordement', () =>
      DocumentProjet.documentFactory({
        ...commonPayload,
        nomChampDocument: 'conventionDeRaccordement',
      }),
    )
    .with('convention-directe-de-raccordement', () =>
      DocumentProjet.documentFactory({
        ...commonPayload,
        nomChampDocument: 'conventionDirecteDeRaccordement',
      }),
    )
    .exhaustive();
};
