import { Candidature } from '@potentiel-domain/projet';

import { Champs, getStringValue } from './graphql';
import { reverseRecord } from './utils';

const typeGfMap = reverseRecord({
  'garantie-bancaire':
    'Garantie à première demande et émise au profit de l’État par un établissement de crédit ou une entreprise d’assurance ou de cautionnement ',
  'six-mois-après-achèvement': `Garantie financière jusqu'à 6 mois après la date d'achèvement`,
  consignation: 'Consignation entre les mains de la Caisse des dépôts et Consignations (CDC) ',
} satisfies Partial<Record<Candidature.TypeGarantiesFinancières.RawType, string>>);

export const getTypeGarantiesFinancières = (champs: Champs) => {
  const typeGf = getStringValue(champs, 'Type de garanties financières');

  if (!typeGf) {
    return;
  }
  if (typeGfMap[typeGf]) {
    return typeGfMap[typeGf];
  }
  throw new Error('Le type de garanties financières est inconnu');
};
