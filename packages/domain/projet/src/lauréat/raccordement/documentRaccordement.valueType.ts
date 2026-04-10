import { join } from 'path';

import { DocumentProjet, DossierProjet } from '#document-projet';

const domaine = 'raccordement';

const typeAccuséRéception = 'accusé-réception';
const typePropositionTechniqueEtFinancière = 'proposition-technique-et-financière';

export const dossierProjetRaccordement = (identifiantProjet: string, référence: string) => {
  return {
    accuséRéception: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(domaine, référence, typeAccuséRéception),
    }),
    propositionTechniqueEtFinancière: DossierProjet.convertirEnValueType({
      identifiantProjet,
      typeDocument: join(domaine, référence, typePropositionTechniqueEtFinancière),
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
  typeDocument: typePropositionTechniqueEtFinancière,
  nomChampDocument: 'propositionTechniqueEtFinancièreSignée',
  nomChampDate: 'dateSignature',
});
