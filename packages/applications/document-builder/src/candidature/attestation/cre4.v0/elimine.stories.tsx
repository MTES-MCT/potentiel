// eslint-disable-next-line no-restricted-imports
import { eolien } from '@potentiel-domain/inmemory-referential/src/appelOffre/CRE4';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AttestationCandidatureOptions } from '../AttestationCandidatureOptions';

import { makeCertificate } from './makeCertificate';

export default { title: 'Attestations PDF/CRE4/v0' };

const fakeProject: AttestationCandidatureOptions = {
  appelOffre: eolien,
  période: eolien.periodes[0],
  isClasse: true,
  famille: eolien.periodes[0].familles[0],
  prixReference: 42,
  evaluationCarbone: 42,
  isFinancementParticipatif: true,
  isInvestissementParticipatif: true,
  engagementFournitureDePuissanceAlaPointe: true,
  motifsElimination: 'motifsElimination',
  note: 42,
  notifiedOn: 42,
  nomRepresentantLegal: 'nomRepresentantLegal',
  nomCandidat: 'nomCandidat',
  email: 'email',
  nomProjet: 'nomProjet',
  adresseProjet: 'adresseProjet',
  codePostalProjet: 'codePostalProjet',
  communeProjet: 'communeProjet',
  puissance: 42,
  potentielId: 'potentielId',
  territoireProjet: 'territoireProjet',
  technologie: 'N/A',
};

const validateur = {
  fullName: 'Nom du signataire',
  fonction: 'fonction du signataire',
} as AppelOffre.Validateur;

export const EliminePPE2AuDessusDePcible = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Au-dessus de Pcible',
  };
  return makeCertificate(project, validateur);
};

export const EliminePPE2DéjàLauréatNonInstruit = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Déjà lauréat - Non instruit',
  };
  return makeCertificate(project, validateur);
};
