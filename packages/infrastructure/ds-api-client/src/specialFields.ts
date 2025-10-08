import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { reverseRecord } from './utils';
import { createDossierAccessor, DossierAccessor, GetDossierQuery } from './graphql';

class ValeurInconnuePourChampsSelectError extends Error {
  constructor(
    public nomDuChamp: string,
    public valeur: unknown,
  ) {
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
  throw new ValeurInconnuePourChampsSelectError(nom, value);
};

const typeGfMap = reverseRecord({
  consignation: 'Consignation',
  'avec-date-échéance': 'Garantie bancaire',
  exemption: `Exemption`,
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

const typeNatureDeLExploitationMap = reverseRecord({
  'vente-avec-injection-du-surplus': 'Vente avec injection du surplus',
  'vente-avec-injection-en-totalité': `Vente avec injection en totalité`,
} satisfies Partial<
  Record<Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.RawType, string>
>);

export const getTypeNatureDeLExploitation = <
  T extends Record<string, string>,
  TName extends string & keyof T,
>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => mapSelectToValueType(typeNatureDeLExploitationMap, accessor, nom);

const gfDateLabels = {
  exemption: "Date de la délibération portant sur le projet objet de l'offre",
  consignation: 'Date de la consignation',
  'avec-date-échéance': "Date de prise d'effet de la garantie financière",
} as const;

export const getDateConstitutionGarantiesFinancières = (
  typeGarantiesFinancieres: ReturnType<typeof getTypeGarantiesFinancières>,
  champs: GetDossierQuery['dossier']['champs'],
  demarche: GetDossierQuery['dossier']['demarche']['revision']['champDescriptors'],
) => {
  if (!typeGarantiesFinancieres) return undefined;

  const label = gfDateLabels[typeGarantiesFinancieres];
  if (!label) return undefined;

  const accessor = createDossierAccessor(
    champs,
    { dateConstitutionGf: label } as Record<'dateConstitutionGf', string>,
    demarche,
  );

  return accessor.getDateValue('dateConstitutionGf');
};

type GetDispositifDeStockageProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampsInstallation: keyof TDossier;
  nomChampCapacité: keyof TDossier;
  nomChampPuissance: keyof TDossier;
};

export const getDispositifDeStockage = <TDossier extends Record<string, string>>({
  accessor,
  nomChampsInstallation,
  nomChampCapacité,
  nomChampPuissance,
}: GetDispositifDeStockageProps<TDossier>): Lauréat.DispositifDeStockage.DispositifDeStockage.RawType => {
  const installationAvecDispositifDeStockage =
    accessor.getBooleanValue(nomChampsInstallation) ?? false;
  const capacitéDuDispositifDeStockageEnKWh = accessor.getNumberValue(nomChampCapacité);
  const puissanceDuDispositifDeStockageEnKW = accessor.getNumberValue(nomChampPuissance);

  return installationAvecDispositifDeStockage
    ? {
        installationAvecDispositifDeStockage,
        capacitéDuDispositifDeStockageEnKWh,
        puissanceDuDispositifDeStockageEnKW,
      }
    : { installationAvecDispositifDeStockage };
};
