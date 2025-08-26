import { Candidature } from '@potentiel-domain/projet';

import { reverseRecord } from './utils';
import { DossierAccessor } from './graphql';

class ValeurInconnuePourChampsSelectError extends Error {
  constructor(public nomDuChamp: string) {
    super('La valeur fournie est invalide');
  }
}

const mapSelectToValueType = <T>(
  map: Record<string, T>,
  accessor: DossierAccessor,
  nom: string,
) => {
  const value = accessor.getStringValue(nom);
  if (!value) {
    return;
  }
  if (map[value]) {
    return map[value];
  }
  throw new ValeurInconnuePourChampsSelectError(nom);
};

const typeGfMap = reverseRecord({
  'garantie-bancaire':
    'Garantie à première demande et émise au profit de l’État par un établissement de crédit ou une entreprise d’assurance ou de cautionnement',
  'six-mois-après-achèvement': `Garantie financière jusqu'à 6 mois après la date d'achèvement`,
  consignation: 'Consignation entre les mains de la Caisse des dépôts et Consignations (CDC)',
  exemption: `Exemption de fourniture (collectivité territoriale ou groupement de collectivités territoriales)`,
} satisfies Partial<Record<Candidature.TypeGarantiesFinancières.RawType, string>>);
export const getTypeGarantiesFinancières = <
  T extends Record<string, string>,
  TName extends string & keyof T,
>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => mapSelectToValueType(typeGfMap, accessor, nom);

const typeHistoriqueAbandonMap = reverseRecord({
  'abandon-classique': `Le projet avait été retenu mais a demandé l'abandon de son statut de lauréat`,
  'première-candidature': `Le projet n'avait pas été retenu`,
} satisfies Partial<Record<Candidature.HistoriqueAbandon.RawType, string>>);

export const getHistoriqueAbandon = <
  T extends Record<string, string>,
  TName extends string & keyof T,
>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => mapSelectToValueType(typeHistoriqueAbandonMap, accessor, nom) ?? 'première-candidature';

const typologieBâtimentMap = reverseRecord({
  neuf: `Bâtiment neuf`,
  'existant-avec-rénovation-de-toiture': `Bâtiment existant avec rénovation de toiture`,
  'existant-sans-rénovation-de-toiture': 'Bâtiment existant sans rénovation de toiture',
  mixte: 'Bâtiment autre',
} satisfies Partial<Record<Candidature.TypologieBâtiment.RawType, string>>);

export const getTypologieBâtiment = <
  T extends Record<string, string>,
  TName extends string & keyof T,
>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => mapSelectToValueType(typologieBâtimentMap, accessor, nom);

export const getLocalité = <T extends Record<string, string>, TName extends string & keyof T>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => {
  const { streetAddress, departmentName, regionName, cityName, postalCode } =
    accessor.getAdresse(nom) ?? {};

  return {
    adresse1: streetAddress ?? undefined,
    département: departmentName ?? undefined,
    région: regionName ?? undefined,
    commune: cityName ?? undefined,
    codePostal: postalCode ?? undefined,
  };
};

type GetAutorisationDUrbanismeProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampDate: keyof TDossier;
  nomChampNuméro: keyof TDossier;
};
export const getAutorisationDUrbanisme = <TDossier extends Record<string, string>>({
  accessor,
  nomChampDate,
  nomChampNuméro,
}: GetAutorisationDUrbanismeProps<TDossier>) => {
  const numéro = accessor.getStringValue(nomChampNuméro);
  const date = accessor.getDateValue(nomChampDate);

  if (numéro && date) {
    return {
      numéro,
      date,
    };
  }
};
