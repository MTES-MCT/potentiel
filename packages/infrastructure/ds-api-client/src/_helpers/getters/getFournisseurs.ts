import { Candidature } from '@potentiel-domain/projet';

import { Champs, createDossierAccessor } from '../../graphql/accessor.js';

export const getFournisseurs = (champs: Champs) => {
  const fournisseurs: Candidature.Dépôt.RawType['fournisseurs'] = [];

  const rootAccessor = createDossierAccessor(champs, {
    dispositifDeProduction:
      'Pour chaque fabricant de dispositif de production, ajouter un bloc contenant les informations du fabricant:',
    posteDeConversion:
      'Pour chaque poste de conversion, ajouter un bloc contenant les informations du poste de conversion:',
    dispositifDeStockage_nom: 'Stockage - Nom du fabricant',
    dispositifDeStockage_pays: 'Stockage - Pays de fabrication',
  });

  // Dispositif de production
  for (const { champs } of rootAccessor.getRepetitionChamps('dispositifDeProduction') ?? []) {
    const accessor = createDossierAccessor(champs, {
      nomDuFabricant: 'Dispositif de production - Nom du fabricant',
      lieuDeFabrication: 'Dispositif de production - Pays de fabrication',
    });
    const nomDuFabricant = accessor.getStringValue('nomDuFabricant');
    const lieuDeFabrication = accessor.getStringValue('lieuDeFabrication');
    if (nomDuFabricant && lieuDeFabrication) {
      fournisseurs.push({
        typeFournisseur: 'dispositif-de-production',
        nomDuFabricant,
        lieuDeFabrication,
      });
    }
  }

  // Poste de conversion
  for (const { champs } of rootAccessor.getRepetitionChamps('posteDeConversion') ?? []) {
    const accessor = createDossierAccessor(champs, {
      nomDuFabricant: 'Poste de conversion - Nom du fabricant',
      lieuDeFabrication: 'Poste de conversion - Pays de fabrication',
    });
    const nomDuFabricant = accessor.getStringValue('nomDuFabricant');
    const lieuDeFabrication = accessor.getStringValue('lieuDeFabrication');
    if (nomDuFabricant && lieuDeFabrication) {
      fournisseurs.push({ typeFournisseur: 'poste-conversion', nomDuFabricant, lieuDeFabrication });
    }
  }

  // Dispositif de stockage
  const stockageNom = rootAccessor.getStringValue('dispositifDeStockage_nom');
  const stockagePays = rootAccessor.getStringValue('dispositifDeStockage_pays');

  if (stockageNom && stockagePays) {
    fournisseurs.push({
      typeFournisseur: 'dispositif-de-stockage',
      nomDuFabricant: stockageNom,
      lieuDeFabrication: stockagePays,
    });
  }

  return fournisseurs;
};
