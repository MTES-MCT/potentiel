import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { Champs } from '../../graphql/index.js';

import { findMultipleDropDownListChamp, findRepetitionChamp, findTextChamp } from './utils.js';

export const getFournisseurs = (champs: Champs) => {
  const fournisseurs: Candidature.Dépôt.RawType['fournisseurs'] = [];

  const addFournisseurs = (
    typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.RawType,
    partialChampLabel: string,
    blocLabel: string,
  ) => {
    const groupeDeFournisseurs = findRepetitionChamp(champs, blocLabel);
    if (!groupeDeFournisseurs?.rows) return;

    groupeDeFournisseurs.rows.forEach((fournisseur) => {
      const fournisseurObject = Object.fromEntries(
        fournisseur.champs.map((champ) => [champ.label, champ.stringValue]),
      );

      const nomDuFabricant = fournisseurObject[`${partialChampLabel} - Nom du fabricant`];
      const lieuDeFabrication = fournisseurObject[`${partialChampLabel} - Pays de fabrication`];

      if (nomDuFabricant && lieuDeFabrication) {
        fournisseurs.push({ typeFournisseur, nomDuFabricant, lieuDeFabrication });
      }
    });
  };

  // Dispositif de production
  addFournisseurs(
    'dispositif-de-production',
    'Dispositif de production',
    'Pour chaque fabricant de dispositif de production, ajouter un bloc contenant les informations du fabricant:',
  );

  // Poste de conversion
  addFournisseurs(
    'poste-conversion',
    'Poste de conversion',
    'Pour chaque poste de conversion, ajouter un bloc contenant les informations du poste de conversion:',
  );

  // Dispositif de stockage
  const stockageNom = findTextChamp(champs, 'Stockage - Nom du fabricant');
  const stockagePays = findMultipleDropDownListChamp(champs, 'Stockage - Pays de fabrication');
  if (stockageNom?.stringValue && stockagePays?.stringValue) {
    fournisseurs.push({
      typeFournisseur: 'dispositif-de-stockage',
      nomDuFabricant: stockageNom.stringValue,
      lieuDeFabrication: stockagePays.stringValue,
    });
  }

  return fournisseurs;
};
