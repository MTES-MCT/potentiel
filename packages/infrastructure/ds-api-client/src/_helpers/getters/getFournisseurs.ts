import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { Champs, RepetitionChamp } from '../../graphql/index.js';

export const getFournisseurs = (champs: Champs) => {
  const fournisseurs: Candidature.Dépôt.RawType['fournisseurs'] = [];

  const normalizeLabel = (label: string) => label.trim().toLowerCase();

  const findChampBlocsRépétés = (label: string): RepetitionChamp | undefined =>
    champs.find(
      (champ) =>
        champ.__typename === 'RepetitionChamp' &&
        normalizeLabel(champ.label) === normalizeLabel(label),
    ) as RepetitionChamp | undefined;

  const findTextChamp = (label: string) =>
    champs.find(
      (champ) =>
        champ.__typename === 'TextChamp' && normalizeLabel(champ.label) === normalizeLabel(label),
    );

  const addFournisseurs = (
    typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.RawType,
    partialChampLabel: string,
    blocLabel: string,
  ) => {
    const groupeDeFournisseurs = findChampBlocsRépétés(blocLabel);
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
  const stockageNom = findTextChamp('Stockage - Nom du fabricant');
  const stockagePays = findTextChamp('Stockage - Pays de fabrication');
  if (stockageNom?.stringValue && stockagePays?.stringValue) {
    fournisseurs.push({
      typeFournisseur: 'dispositif-de-stockage',
      nomDuFabricant: stockageNom.stringValue,
      lieuDeFabrication: stockagePays.stringValue,
    });
  }

  return fournisseurs;
};
