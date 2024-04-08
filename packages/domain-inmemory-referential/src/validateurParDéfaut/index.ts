import { ValidateurParDéfaut } from '@potentiel-domain/appel-offre';

export const validateurParDéfaut = {
  sd2: {
    name: 'Sous-directeur bureau SD2',
    fonction: 'Sous-directrice du système électrique et des énergies renouvelables',
  } satisfies ValidateurParDéfaut,
  hermine: {
    name: 'Hermine DURAND',
    fonction: `Sous-directrice du système électrique et des énergies renouvelables`,
  } satisfies ValidateurParDéfaut,
  nicolas: {
    name: 'Nicolas CLAUSSET',
    fonction: `Le sous-directeur du système électrique et des énergies renouvelables`,
  } satisfies ValidateurParDéfaut,
  ghislain: {
    name: 'Ghislain FERRAN',
    fonction: `L’adjoint au sous-directeur du système électrique et des énergies renouvelables`,
  } satisfies ValidateurParDéfaut,
};
