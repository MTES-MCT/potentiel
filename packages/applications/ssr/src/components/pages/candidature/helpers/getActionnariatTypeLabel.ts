import { Candidature } from '@potentiel-domain/candidature';

export const getActionnariatTypeLabel = (type: Candidature.TypeActionnariat.RawType): string => {
  switch (type) {
    case 'financement-collectif':
      return 'Financement Collectif';
    case 'financement-participatif':
      return 'Financement Participatif';
    case 'gouvernance-partagée':
      return 'Gouvernance Partagée';
    case 'investissement-participatif':
      return 'Investissement Participatif';
  }
};
