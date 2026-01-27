import { Candidature } from '../../../../..';

import { mapDétailsToFournisseur } from './mapDétailsToFournisseur';

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
 * }
 * ```
 * en un array ayant pour forme :
 * ```
 * [
 *  { typeFournisseur: 'cellules', nomDuFabricant:"AAA", lieuDeFabrication: 'Chine', },
 *  { typeFournisseur: 'cellules', nomDuFabricant:"BBB", lieuDeFabrication: 'Japon', },
 *  { typeFournisseur: 'cellules', nomDuFabricant:"CCC", lieuDeFabrication: 'Italie' },
 *  { typeFournisseur: 'polysilicium', nomDuFabricant:"CCC", lieuDeFabrication: 'Etats-Unis' },
 * ]
 * ```
 *
 */
export const mapDétailCSVToDétailFournisseur = (
  payload: Record<string, string>,
): Candidature.DétailFournisseur[] => {
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
  return Object.values(Object.groupBy(fieldsArray, (item) => item.type + '-' + item.index))
    .filter((champsParTypeEtIndex) => !!champsParTypeEtIndex)
    .map((champsParTypeEtIndex) =>
      champsParTypeEtIndex.reduce(
        (acc, { field, valeur }) => {
          if (field === 'Nom du fabricant') acc.nomDuFabricant = valeur ?? undefined;
          if (field === 'Lieu(x) de fabrication') acc.lieuDeFabrication = valeur ?? undefined;
          if (field === 'Coût total du lot (M€)') acc.coûtTotalLot = valeur ?? undefined;
          if (field === 'Contenu local français (%)')
            acc.contenuLocalFrançais = valeur ?? undefined;
          if (field === 'Contenu local européen (%)')
            acc.contenuLocalEuropéen = valeur ?? undefined;
          if (field === 'Technologie') acc.technologie = valeur ?? undefined;
          if (field === 'Puissance crête Wc') acc.puissanceCrêteWc = valeur ?? undefined;
          if (field === 'Rendement nominal (%)') acc.rendementNominal = valeur ?? undefined;
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
          rendementNominal: undefined,
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
