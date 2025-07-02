import { Lauréat } from '@potentiel-domain/projet';

// Etat actuel des colonnes du CSV
const champsCsvFournisseur: Record<Lauréat.Fournisseur.TypeFournisseur.RawType, string> = {
  'module-ou-films': 'Modules ou films',
  cellules: 'Cellules',
  'plaquettes-silicium': 'Plaquettes de silicium (wafers)',
  polysilicium: 'Polysilicium',
  'postes-conversion': 'Postes de conversion',
  structure: 'Structure',
  'dispositifs-stockage-energie': "Dispositifs de stockage de l'énergie *",
  'dispositifs-suivi-course-soleil': 'Dispositifs de suivi de la course du soleil *',
  'autres-technologies': 'Autres technologies',
  'dispositif-de-production': 'dispositif de production',
  'dispositif-de-stockage': 'Dispositif de stockage',
  'poste-conversion': 'Poste de conversion',
};

// on garde le sens "type" -> "label CSV" ci-dessus pour bénéficier du typage exhaustif
// mais on l'inverse pour l'utilisation
const labelCsvToTypeFournisseur = Object.fromEntries(
  Object.entries(champsCsvFournisseur).map(([key, value]) => [value, key]),
) as Record<string, Lauréat.Fournisseur.TypeFournisseur.RawType>;

const regex = /^(?<field>[\w\s()]*)\s?\s\((?<type>.*)\)\s(?<index>\d)$/;

const mapDétailsToFournisseur = (key: string) => {
  const { type, index, field } =
    key.replaceAll('’', "'").replaceAll('\n', '').match(regex)?.groups ?? {};
  if (type && labelCsvToTypeFournisseur[type]) {
    return {
      type: Lauréat.Fournisseur.TypeFournisseur.convertirEnValueType(
        labelCsvToTypeFournisseur[type],
      ).formatter(),
      field,
      index,
    };
  }
};

/**
 * Convertit un objet ayant pour forme :
 * ```
 * {
 *  "Nom du fabricant (Cellules) 1": "AAA",
 *  "Nom du fabricant (Cellules) 2": "BBB",
 *  "Lieu(x) de fabrication (Cellules) 1": "Chine",
 *  "Lieu(x) de fabrication (Cellules) 2": "Italie",
 *  "Nom du fabricant \n(Polysilicium) 1": "CCC",
 *  "Lieu(x) de fabrication \n(Polysilicium) 1": "Etats-Unis",
 * }
 * ```
 * en un array ayant pour forme :
 * ```
 * [
 *  { typeFournisseur: 'module-ou-films', nomDuProducteur:"AAA", lieuDeFabrication: 'Chine' },
 *  { typeFournisseur: 'module-ou-films', nomDuProducteur:"BBB", lieuDeFabrication: 'Italie' },
 *  { typeFournisseur: 'polysilicium', nomDuProducteur:"CCC", lieuDeFabrication: 'Etats-Unis' },
 * ]
 * ```
 *
 */
export const mapCsvRowToFournisseurs = (
  payload: Record<string, string>,
): Lauréat.Fournisseur.Fournisseur.RawType[] => {
  // on récupère le type de fournisseur (cellules), la propriété (Nom du fabricant...), l'index (1,2,3...) et la valeur (AAA)
  const fieldsArray = Object.entries(payload)
    .map(([key, value]) => {
      const fournisseur = mapDétailsToFournisseur(key);

      if (fournisseur) {
        return { ...fournisseur, valeur: value };
      }
    })
    .filter((item) => item !== undefined);

  // on construit l'objet complet en groupant par type et index
  // l'index n'est pas utilisé en tant que tel car des valeurs pourraient être omises
  return Object.values(groupBy(fieldsArray, (item) => item.type + '-' + item.index))
    .filter((champsParTypeEtIndex) => !!champsParTypeEtIndex)
    .map((champsParTypeEtIndex) =>
      champsParTypeEtIndex.reduce(
        (prev, { field, valeur }) => {
          if (field === 'Nom du fabricant') prev.nomDuFabricant = valeur;
          if (field === 'Lieu(x) de fabrication') prev.lieuDeFabrication = valeur;
          return prev;
        },
        {
          typeFournisseur: champsParTypeEtIndex[0].type,
          lieuDeFabrication: '',
          nomDuFabricant: '',
        } as Lauréat.Fournisseur.Fournisseur.RawType,
      ),
    )
    .filter((fournisseur) => fournisseur.typeFournisseur && fournisseur.nomDuFabricant);
};

/** @deprecated replace with Object.groupBy when available */
const groupBy = <K extends PropertyKey, T>(
  items: T[],
  keySelector: (item: T, index: number) => K,
): Partial<Record<K, T[]>> =>
  items.reduce(
    (result, item, index) => {
      const key = keySelector(item, index);
      result[key] ??= [];
      result[key].push(item);
      return result;
    },
    {} as Record<K, T[]>,
  );
