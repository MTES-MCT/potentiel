import { Candidature } from '../../../../..';

import { splitDétailsIntoTypeFieldIndex } from './mapDétailsToFournisseur';

const csvLabelToTypeFournisseur: Record<string, string> = {
  'modules ou films': 'module-ou-films',
  cellules: 'cellules',
  'plaquettes de silicium (wafers)': 'plaquettes-silicium',
  polysilicium: 'polysilicium',
  'postes de conversion': 'postes-conversion',
  structure: 'structure',
  "dispositifs de stockage de l'énergie": 'dispositifs-stockage-energie',
  'dispositifs de suivi de la course du soleil': 'dispositifs-suivi-course-soleil',
  'autres technologies': 'autres-technologies',
  'dispositif de production': 'dispositif-de-production',
  'dispositif de stockage': 'dispositif-de-stockage',
  'poste de conversion': 'poste-conversion',
  développement: 'développement',
  developpement: 'développement',
  raccordement: 'raccordement',
  turbine: 'turbine',
  'génie civil': 'génie-civil',
  'fourniture, transport, montage': 'fourniture-transport-montage',
  'installation et mise en service': 'installation-mise-en-service',
  'fabrication de composants et assemblage': 'fabrication-de-composants-et-assemblage',
};

/**
 * Convertit un objet ayant pour forme :
 * ```
 * {
 *  "Nom du fabricant (Cellules)": "AAA",
 *  "Nom du fabricant (Cellules) 1": "BBB",
 *  "Nom du fabricant (Cellules) 2": "CCC",
 *  "Lieu(x) de fabrication (Cellules)": "Chine",
 *  "Lieu(x) de fabrication (Cellules) 1": "Japon",
 *  "Lieu(x) de fabrication (Cellules) 2": "Italie",
 *  "Nom du fabricant (Polysilicium) 1": "CCC",
 *  "Lieu(x) de fabrication (Polysilicium) 1": "Etats-Unis",
 *  "Contenu local Fabrication de composants et assemblage : Pourcentage de contenu local européen": "10"
 * }
 * ```
 * en un array ayant pour forme :
 * ```
 * [
 *  { typeFournisseur: 'cellules', nomDuFabricant:"AAA", lieuDeFabrication: 'Chine', },
 *  { typeFournisseur: 'cellules', nomDuFabricant:"BBB", lieuDeFabrication: 'Japon', },
 *  { typeFournisseur: 'cellules', nomDuFabricant:"CCC", lieuDeFabrication: 'Italie' },
 *  { typeFournisseur: 'polysilicium', nomDuFabricant:"CCC", lieuDeFabrication: 'Etats-Unis' },
 *  { typeFournisseur: 'fabrication-de-composants-et-assemblage', contenuLocalEuropéen: '10' },
 * ]
 * ```
 *
 */
export const mapDétailCSVToDétailFournisseur = (
  payload: Record<string, string>,
): Candidature.DétailFournisseur[] => {
  // on récupère le type de fournisseur (cellules), la propriété (Nom du fabricant...), l'index (1,2,3...) et la valeur (AAA)
  const fieldsArray = Object.entries(payload)
    .map(([key, valeur]) => {
      const fournisseur = splitDétailsIntoTypeFieldIndex(key);

      if (!fournisseur.type) {
        return;
      }
      const type = csvLabelToTypeFournisseur[fournisseur.type.toLowerCase().trim()];
      const field = fournisseur.field.trim();

      if (type && field) {
        return { type, field, index: fournisseur.index, valeur };
      }
    })
    .filter((item) => item !== undefined);

  // on construit l'objet complet en groupant par type et index
  // l'index n'est pas utilisé en tant que tel car des valeurs pourraient être omises
  return Object.values(Object.groupBy(fieldsArray, (item) => item.type + '-' + item.index))
    .filter((champsParTypeEtIndex) => !!champsParTypeEtIndex)
    .map((champsParTypeEtIndex) =>
      champsParTypeEtIndex.reduce(
        (acc, { field, valeur }) => {
          if (field === 'Nom du fabricant') acc.nomDuFabricant = valeur ?? undefined;
          if (field === 'Lieu de fabrication') acc.lieuDeFabrication = valeur ?? undefined;
          if (field === 'Coût total du lot') acc.coûtTotalLot = valeur ?? undefined;
          if (field === 'Contenu local français') acc.contenuLocalFrançais = valeur ?? undefined;
          if (field === 'Contenu local européen') acc.contenuLocalEuropéen = valeur ?? undefined;
          if (field === 'Technologie') acc.technologie = valeur ?? undefined;
          if (field === 'Puissance crête') acc.puissanceCrêteWc = valeur ?? undefined;
          if (field === 'Rendement nominal') acc.rendementNominal = valeur ?? undefined; // TODO : à voir si on le garde ou pas
          if (field === 'Référence commerciale') acc.référenceCommerciale = valeur ?? undefined; // TODO : à voir si on le garde ou pas
          return acc;
        },
        {
          typeFournisseur: champsParTypeEtIndex[0].type,
          lieuDeFabrication: undefined,
          nomDuFabricant: undefined,
          coûtTotalLot: undefined,
          contenuLocalFrançais: undefined,
          contenuLocalEuropéen: undefined,
          technologie: undefined,
          puissanceCrêteWc: undefined,
          rendementNominal: undefined, // TODO : à voir si on le garde ou pas
          référenceCommerciale: undefined, // TODO : à voir si on le garde ou pas
        } as Candidature.DétailFournisseur,
      ),
    )
    .filter((fournisseur) => fournisseur.typeFournisseur)
    .map((fournisseur) => {
      return Object.fromEntries(
        Object.entries(fournisseur).filter(([_, value]) => value !== undefined && value !== ''),
      );
    })
    .filter(
      (fournisseur) => Object.keys(fournisseur).length > 1,
    ) as Candidature.DétailFournisseur[];
};
