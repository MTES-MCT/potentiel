import { match } from 'ts-pattern';

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

type GetTypologieDInstallationProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampTypologieBâtiment: keyof TDossier;
  nomChampTypologieOmbrière: keyof TDossier;
  nomChampÉlémentsSousOmbrière: keyof TDossier;
  nomChampÉlémentsSousSerre: keyof TDossier;
};
export const getTypologieInstallation = <TDossier extends Record<string, string>>({
  accessor,
  nomChampTypologieBâtiment,
  nomChampTypologieOmbrière,
  nomChampÉlémentsSousSerre,
  nomChampÉlémentsSousOmbrière,
}: GetTypologieDInstallationProps<TDossier>) => {
  const typologieBâtimentField = accessor.getStringValue(nomChampTypologieBâtiment);
  const typologieOmbrièreField = accessor.getStringValue(nomChampTypologieOmbrière);
  const élementSousOmbrièreField = accessor.getStringValue(nomChampÉlémentsSousOmbrière);
  const élémentsSousSerreField = accessor.getStringValue(nomChampÉlémentsSousSerre);

  const typologieInstallation: Array<Candidature.TypologieInstallation.RawType> = [];

  if (typologieBâtimentField) {
    const typologieBâtiment = match(typologieBâtimentField)
      .returnType<Candidature.TypologieInstallation.RawType>()
      .with('bâtiment neuf', () => ({
        typologie: 'bâtiment.neuf',
      }))
      .with('bâtiment existant avec rénovation de toiture', () => ({
        typologie: 'bâtiment.existant-avec-rénovation-de-toiture',
      }))
      .with('bâtiment existant sans rénovation de toiture', () => ({
        typologie: 'bâtiment.existant-sans-rénovation-de-toiture',
      }))
      .with('mixte', () => ({
        typologie: 'bâtiment.mixte',
      }))
      .with('autre', () => ({
        typologie: 'bâtiment.mixte',
      }))
      .otherwise(() => ({ typologie: 'bâtiment.mixte' })); // valeur par défaut : mixte ou autre ?

    typologieInstallation.push(typologieBâtiment);
  }

  if (typologieOmbrièreField) {
    const typologieBâtiment = match(typologieOmbrièreField)
      .returnType<Candidature.TypologieInstallation.RawType>()
      .with('Ombrière sur parking', () => ({
        typologie: 'ombrière.parking',
      }))
      .with('Ombrière autre', () => ({
        typologie: 'ombrière.autre',
      }))
      .with('Ombrière mixte (sur parking et autre)', () => ({
        typologie: 'ombrière.mixte',
      }))
      .otherwise(() => ({ typologie: 'ombrière.autre' }));

    typologieInstallation.push(typologieBâtiment);
  }

  if (élementSousOmbrièreField) {
    const ombrièreIndex = typologieInstallation.findIndex(
      (elem) => elem.typologie === 'ombrière.mixte' || elem.typologie === 'ombrière.autre',
    );

    if (ombrièreIndex !== -1) {
      typologieInstallation[ombrièreIndex] = {
        ...typologieInstallation[ombrièreIndex],
        détails: élementSousOmbrièreField,
      };
    } else {
      typologieInstallation.push({
        typologie: 'ombrière.autre',
        détails: élementSousOmbrièreField,
      });
    }
  }

  if (élémentsSousSerreField) {
    typologieInstallation.push({
      typologie: 'serre',
      détails: élémentsSousSerreField,
    });
  }

  return typologieInstallation;
};
