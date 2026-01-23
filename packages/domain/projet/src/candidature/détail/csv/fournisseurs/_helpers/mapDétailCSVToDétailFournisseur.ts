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
        (prev, { field, valeur }) => {
          if (field === 'Nom du fabricant') prev.nomDuFabricant = valeur;
          if (field === 'Lieu(x) de fabrication') prev.lieuDeFabrication = valeur;
          if (field === 'Coût total du lot (M€)') prev.coûtTotalLot = valeur;
          if (field === 'Contenu local français (%)') prev.contenuLocalFrançais = valeur;
          if (field === 'Contenu local européen (%)') prev.contenuLocalEuropéen = valeur;
          if (field === 'Technologie') prev.technologie = valeur;
          if (field === 'Puissance crête Wc') prev.puissanceCrêteWc = valeur;
          if (field === 'Rendement nominal (%)') prev.rendementNominal = valeur;
          return prev;
        },
        {
          typeFournisseur: champsParTypeEtIndex[0].type,
          lieuDeFabrication: '',
          nomDuFabricant: '',
          coûtTotalLot: '',
          contenuLocalFrançais: '',
          contenuLocalEuropéen: '',
          puissanceCrêteWc: '',
          rendementNominal: '',
          technologie: '',
        } as Candidature.DétailFournisseur,
      ),
    )
    .filter((fournisseur) => fournisseur.typeFournisseur);
};
