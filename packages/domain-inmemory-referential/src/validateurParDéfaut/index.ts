import { Validateur } from '@potentiel-domain/appel-offre';

export const validateurParDéfaut = {
  sd2: {
    fullName: 'Sous-directeur bureau SD2',
    fonction: 'Sous-directrice du système électrique et des énergies renouvelables',
  } satisfies Validateur,
  hermine: {
    fullName: 'Hermine DURAND',
    fonction: `Sous-directrice du système électrique et des énergies renouvelables`,
  } satisfies Validateur,
  nicolas: {
    fullName: 'Nicolas CLAUSSET',
    fonction: `Le sous-directeur du système électrique et des énergies renouvelables`,
  } satisfies Validateur,
  ghislain: {
    fullName: 'Ghislain FERRAN',
    fonction: `L’adjoint au sous-directeur du système électrique et des énergies renouvelables`,
  } satisfies Validateur,
};
