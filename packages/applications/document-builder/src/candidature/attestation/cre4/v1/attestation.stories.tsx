// eslint-disable-next-line no-restricted-imports
import { eolien } from '@potentiel-domain/inmemory-referential/src/appelOffre/CRE4';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AttestationCandidatureOptions } from '../../AttestationCandidatureOptions';

import { makeCertificate as _makeCertificate } from './makeCertificate';

export default { title: 'Attestations PDF/CRE4/v1' };

const makeCertificate = (
  project: AttestationCandidatureOptions,
  validateur: AppelOffre.Validateur,
) => _makeCertificate(project, validateur, '/images');

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
  notifiedOn: Date.now(),
  nomRepresentantLegal: 'nomRepresentantLegal',
  nomCandidat: 'nomCandidat',
  email: 'email',
  nomProjet: 'nomProjet',
  adresseProjet: 'adresseProjet',
  codePostalProjet: 'codePostalProjet',
  communeProjet: 'communeProjet',
  puissance: 42,
  potentielId: 'potentielId',
  technologie: 'N/A',
};

const validateur = {
  fullName: 'Nom du signataire',
  fonction: 'fonction du signataire',
} as AppelOffre.Validateur;

export const ElimineAuDessusDePcible = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Au-dessus de Pcible',
  };
  return makeCertificate(project, validateur);
};

export const ElimineDéjàLauréatNonInstruit = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
    isClasse: false,
    motifsElimination: 'Déjà lauréat - Non instruit',
  };
  return makeCertificate(project, validateur);
};

export const Lauréat = () => {
  const project: AttestationCandidatureOptions = {
    ...fakeProject,
  };
  return makeCertificate(project, validateur);
};
