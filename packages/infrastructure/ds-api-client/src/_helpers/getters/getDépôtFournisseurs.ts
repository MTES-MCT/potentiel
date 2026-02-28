import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { Champs } from '../../graphql/index.js';

export const getDépôtFournisseurs = (champs: Champs) => {
  const fournisseurs: Candidature.Dépôt.RawType['fournisseurs'] = [];

  const findTextChamp = (label: string) =>
    champs.find(
      (champ) =>
        champ.__typename === 'TextChamp' &&
        champ.label.trim().toLowerCase() === label.trim().toLowerCase(),
    );

  const addFournisseurs = (
    typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.RawType,
    labelNom: (index: number) => string,
    labelPays: (index: number) => string,
  ) => {
    for (let i = 1; ; i++) {
      const nomChamp = findTextChamp(labelNom(i));
      const paysChamp = findTextChamp(labelPays(i));

      if (!nomChamp || !paysChamp) break;

      if (nomChamp?.stringValue && paysChamp?.stringValue) {
        fournisseurs.push({
          typeFournisseur,
          nomDuFabricant: nomChamp.stringValue,
          lieuDeFabrication: paysChamp.stringValue,
        });
      }
    }
  };

  // Dispositif de production
  addFournisseurs(
    'dispositif-de-production',
    (i) => `Fabricant ${i} - Nom du fabricant`,
    (i) => `Fabricant ${i} - Pays de fabrication`,
  );

  // Poste de conversion
  addFournisseurs(
    'poste-conversion',
    (i) => `Poste de conversion - Nom du fabricant ${i}`,
    (i) => `Poste de conversion - Pays de fabrication ${i}`,
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
