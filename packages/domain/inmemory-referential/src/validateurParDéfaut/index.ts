import { AppelOffre } from '@potentiel-domain/appel-offre';

export const validateurParDéfaut = {
  sd2: {
    nomComplet: 'Sous-directeur bureau SD2',
    fonction: 'Sous-directrice du système électrique et des énergies renouvelables',
  } satisfies AppelOffre.Validateur,
  hermine: {
    nomComplet: 'Hermine DURAND',
    fonction: `Sous-directrice du système électrique et des énergies renouvelables`,
  } satisfies AppelOffre.Validateur,
  nicolas: {
    nomComplet: 'Nicolas CLAUSSET',
    fonction: `Le sous-directeur du système électrique et des énergies renouvelables`,
  } satisfies AppelOffre.Validateur,
  ghislain: {
    nomComplet: 'Ghislain FERRAN',
    fonction: `L’adjoint au sous-directeur du système électrique et des énergies renouvelables`,
  } satisfies AppelOffre.Validateur,
};
