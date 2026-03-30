import { DocumentProjet, DossierProjet } from '#document-projet';

const domaine = 'raccordement';

const typeAccuséRéception = 'accusé-réception';
const typePropositionTechniqueEtFinancière = 'proposition-technique-et-financière';

export const dossierProjetRaccordement = (identifiantProjet: string, référence: string) => {
  return {
    accuséRéception: DossierProjet.convertirEnValueType({
      identifiantProjet,
      cléDocument: référence,
      typeDocument: `${domaine}/${typeAccuséRéception}`,
    }),
    propositionTechniqueEtFinancière: DossierProjet.convertirEnValueType({
      identifiantProjet,
      cléDocument: référence,
      typeDocument: `${domaine}/${typePropositionTechniqueEtFinancière}`,
    }),
  };
};

export const accuséRéception = DocumentProjet.documentFactory({
  domaine,
  nomCléDocument: 'référence',
  typeDocument: typeAccuséRéception,
  nomChampDocument: 'accuséRéception',
  nomChampDate: 'dateQualification',
});

export const propositionTechniqueEtFinancière = DocumentProjet.documentFactory({
  domaine,
  nomCléDocument: 'référence',
  typeDocument: typePropositionTechniqueEtFinancière,
  nomChampDocument: 'propositionTechniqueEtFinancièreSignée',
  nomChampDate: 'dateSignature',
});
