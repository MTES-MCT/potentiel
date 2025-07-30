import { Candidature } from '@potentiel-domain/projet';

import { Champs, getChampValue, getStringValue } from './graphql';
import { reverseRecord } from './utils';

const typeGfMap = reverseRecord({
  'garantie-bancaire':
    'Garantie à première demande et émise au profit de l’État par un établissement de crédit ou une entreprise d’assurance ou de cautionnement',
  'six-mois-après-achèvement': `Garantie financière jusqu'à 6 mois après la date d'achèvement`,
  consignation: 'Consignation entre les mains de la Caisse des dépôts et Consignations (CDC)',
  exemption: `Exemption de fourniture (collectivité territoriale ou groupement de collectivités territoriales)`,
} satisfies Partial<Record<Candidature.TypeGarantiesFinancières.RawType, string>>);

export const getTypeGarantiesFinancières = (champs: Champs, nom: string) => {
  const typeGf = getStringValue(champs, nom);

  if (!typeGf) {
    return;
  }
  if (typeGfMap[typeGf]) {
    return typeGfMap[typeGf];
  }
  throw new Error('Le type de garanties financières est inconnu');
};

export const getLocalité = (champs: Champs, nom: string) => {
  const { streetAddress, departmentName, regionName, cityName, postalCode } =
    getChampValue(champs, nom, 'AddressChamp')?.address ?? {};

  return {
    adresse1: streetAddress ?? undefined,
    département: departmentName ?? undefined,
    région: regionName ?? undefined,
    commune: cityName ?? undefined,
    codePostal: postalCode ?? undefined,
  };
};

const typeHistoriqueAbandonMap = reverseRecord({
  'abandon-classique': `Le projet avait été retenu mais a demandé l'abandon de son statut de lauréat`,
  'première-candidature': `Le projet n'avait pas été retenu`,
} satisfies Partial<Record<Candidature.HistoriqueAbandon.RawType, string>>);

export const getHistoriqueAbandon = (
  champs: Champs,
  nom: string,
): Candidature.HistoriqueAbandon.RawType => {
  const historiqueAbandon = getChampValue(champs, nom, 'TextChamp', true)?.stringValue;
  if (!historiqueAbandon) {
    return 'première-candidature';
  }

  return typeHistoriqueAbandonMap[historiqueAbandon];
};
