import { Lauréat } from '@potentiel-domain/projet';

// Etat actuel des colonnes du CSV
const labelCsvToTypeFournisseur: Record<string, Lauréat.Fournisseur.TypeFournisseur.RawType> = {
  'Modules ou films': 'module-ou-films',
  Cellules: 'cellules',
  'Plaquettes de silicium (wafers)': 'plaquettes-silicium',
  Polysilicium: 'polysilicium',
  'Postes de conversion': 'postes-conversion',
  Structure: 'structure',
  "Dispositifs de stockage de l'énergie *": 'dispositifs-stockage-energie',
  'Dispositifs de suivi de la course du soleil *': 'dispositifs-suivi-course-soleil',
  'Autres technologies': 'autres-technologies',
  'dispositif de production': 'dispositif-de-production',
  'Dispositif de stockage': 'dispositifs-stockage-energie',
  'Poste de conversion': 'poste-conversion',
  'Lingot de silicium': 'lingot-de-silicium',
  'Verre solaire': 'verre-solaire',
};

// both field and type can contain parenthesis, for instance: "Lieu(x) de fabrication (Plaquettes de silicium (wafers)) 1"
const regex = /^(?<field>[\w\s()]*)\s+\((?<type>(?:[^()]|\([^()]*\))*)\)\s(?<index>\d)$/;

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
 *  { typeFournisseur: 'cellules', nomDuFabricant:"AAA", lieuDeFabrication: 'Chine' },
 *  { typeFournisseur: 'cellules', nomDuFabricant:"BBB", lieuDeFabrication: 'Italie' },
 *  { typeFournisseur: 'polysilicium', nomDuFabricant:"CCC", lieuDeFabrication: 'Etats-Unis' },
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
      return undefined;
    })
    .filter((item) => item !== undefined);

  // on construit l'objet complet en groupant par type et index
  // l'index n'est pas utilisé en tant que tel car des valeurs pourraient être omises
  return Object.values(Object.groupBy(fieldsArray, (item) => `${item.type}-${item.index}`))
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
