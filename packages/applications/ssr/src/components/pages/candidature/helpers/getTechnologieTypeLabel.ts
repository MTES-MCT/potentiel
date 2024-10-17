import { Candidature } from '@potentiel-domain/candidature';

export const getTechnologieTypeLabel = (type: Candidature.TypeTechnologie.RawType) => {
  switch (type) {
    case 'pv':
      return 'PV';
    case 'hydraulique':
      return 'Hydraulique';
    case 'eolien':
      return 'Éolien';
    case 'N/A':
      return 'N/A';
  }
};
