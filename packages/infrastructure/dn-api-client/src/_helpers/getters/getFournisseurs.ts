import type { Candidature } from '@potentiel-domain/projet';

import { type Champs, createDossierAccessor } from '../../graphql/accessor.js';

export const getFournisseurs = (champs: Champs) => {
  const fournisseurs: Candidature.Dépôt.RawType['fournisseurs'] = [];

  const rootAccessor = createDossierAccessor(champs, {
    dispositifDeProduction:
      'Pour chaque fabricant de dispositif de production, ajouter un bloc contenant les informations du fabricant:',
    posteDeConversion:
      'Pour chaque poste de conversion, ajouter un bloc contenant les informations du poste de conversion:',
    moduleOuFilmPhotovoltaïque:
      'Pour chaque fabricant de composants (modules ou films) photovoltaïques, ajouter un bloc contenant les informations du fabricant',
    cellulesPhotovoltaïques:
      'Pour chaque fabricant de cellules photovoltaïques, ajouter un bloc contenant les informations de cellules photovoltaïques',
    plaquettesSilicium:
      'Pour chaque fabricant de plaquettes de silicium (wafer), ajouter un bloc contenant les informations de plaquettes de silicium (wafers)',
    polysilicium:
      'Pour chaque polysilicium, ajouter un bloc contenant les informations de polysilicium',
    postesConversion:
      'Pour chaque poste de conversion, ajouter un bloc contenant les informations de postes de conversion',
    lingotDeSilicium:
      'Pour chaque lingot de silicium, ajouter un bloc contenant les informations du lingot de silicium',
    verreSolaire:
      'Pour chaque fabricant de verre solaire, ajouter un bloc contenant les informations du verre solaire',
    suiviCourseSoleil_nom: 'Suivi de la course du soleil - Nom du fabricant',
    suiviCourseSoleil_pays: 'Suivi de la course du soleil - Pays de fabrication',
    autreTechnologie_nom: 'Autre technologie - Nom du fabricant',
    autreTechnologie_pays: 'Autre technologie - Pays de fabrication',
    dispositifDeStockage_nom: 'Stockage - Nom du fabricant',
    dispositifDeStockage_pays: 'Stockage - Pays de fabrication',
  });

  // Dispositif de stockage (champ non répétable)
  const stockageNom = rootAccessor.getStringValue('dispositifDeStockage_nom');
  const stockagePays = rootAccessor.getStringValue('dispositifDeStockage_pays');

  if (stockageNom && stockagePays) {
    fournisseurs.push({
      typeFournisseur: 'dispositif-de-stockage',
      nomDuFabricant: stockageNom,
      lieuDeFabrication: stockagePays,
    });
  }

  // autres-technologies (champ non répétable)
  const autreTechnologiePays = rootAccessor.getStringValue('autreTechnologie_pays');
  const autreTechnologieNom = rootAccessor.getStringValue('autreTechnologie_nom');

  if (autreTechnologiePays && autreTechnologieNom) {
    fournisseurs.push({
      typeFournisseur: 'autres-technologies',
      nomDuFabricant: autreTechnologieNom,
      lieuDeFabrication: autreTechnologiePays,
    });
  }

  // Suivi de la course du soleil (champ non répétable)
  const suiviCourseSoleilPays = rootAccessor.getStringValue('suiviCourseSoleil_pays');
  const suiviCourseSoleilNom = rootAccessor.getStringValue('suiviCourseSoleil_nom');

  if (suiviCourseSoleilNom && suiviCourseSoleilPays) {
    fournisseurs.push({
      typeFournisseur: 'dispositifs-suivi-course-soleil',
      nomDuFabricant: suiviCourseSoleilNom,
      lieuDeFabrication: suiviCourseSoleilPays,
    });
  }

  // Postes de conversion
  for (const { champs } of rootAccessor.getRepetitionChamps('postesConversion') ?? []) {
    const accessor = createDossierAccessor(champs, {
      nomDuFabricant: 'Postes de conversion - Nom du fabricant',
      lieuDeFabrication: 'Postes de conversion - Pays de fabrication',
    });
    const nomDuFabricant = accessor.getStringValue('nomDuFabricant');
    const lieuDeFabrication = accessor.getStringValue('lieuDeFabrication');
    if (nomDuFabricant && lieuDeFabrication) {
      fournisseurs.push({
        typeFournisseur: 'postes-conversion',
        nomDuFabricant,
        lieuDeFabrication,
      });
    }
  }

  // Polysilicium
  for (const { champs } of rootAccessor.getRepetitionChamps('polysilicium') ?? []) {
    const accessor = createDossierAccessor(champs, {
      nomDuFabricant: 'Polysilicium - Nom du fabricant',
      lieuDeFabrication: 'Polysilicium - Pays de fabrication',
    });
    const nomDuFabricant = accessor.getStringValue('nomDuFabricant');
    const lieuDeFabrication = accessor.getStringValue('lieuDeFabrication');
    if (nomDuFabricant && lieuDeFabrication) {
      fournisseurs.push({
        typeFournisseur: 'polysilicium',
        nomDuFabricant,
        lieuDeFabrication,
      });
    }
  }

  // Plaquettes de silicium (wafer)
  for (const { champs } of rootAccessor.getRepetitionChamps('plaquettesSilicium') ?? []) {
    const accessor = createDossierAccessor(champs, {
      nomDuFabricant: 'Plaquettes de silicium (wafers) - Nom du fabricant',
      lieuDeFabrication: 'Plaquettes de silicium (wafers) - Pays de fabrication',
    });
    const nomDuFabricant = accessor.getStringValue('nomDuFabricant');
    const lieuDeFabrication = accessor.getStringValue('lieuDeFabrication');
    if (nomDuFabricant && lieuDeFabrication) {
      fournisseurs.push({
        typeFournisseur: 'plaquettes-silicium',
        nomDuFabricant,
        lieuDeFabrication,
      });
    }
  }

  // Cellules photovoltaïque
  for (const { champs } of rootAccessor.getRepetitionChamps('cellulesPhotovoltaïques') ?? []) {
    const accessor = createDossierAccessor(champs, {
      nomDuFabricant: 'Cellules photovoltaïques - Nom du fabricant',
      lieuDeFabrication: 'Cellules photovoltaïques - Pays de fabrication',
    });
    const nomDuFabricant = accessor.getStringValue('nomDuFabricant');
    const lieuDeFabrication = accessor.getStringValue('lieuDeFabrication');
    if (nomDuFabricant && lieuDeFabrication) {
      fournisseurs.push({
        typeFournisseur: 'cellules',
        nomDuFabricant,
        lieuDeFabrication,
      });
    }
  }

  // Module ou film photovoltaïque
  for (const { champs } of rootAccessor.getRepetitionChamps('moduleOuFilmPhotovoltaïque') ?? []) {
    const accessor = createDossierAccessor(champs, {
      nomDuFabricant: 'Composants (modules ou films) photovoltaïques - Nom du fabricant',
      lieuDeFabrication: 'Composants (modules ou films) photovoltaïques - Pays de fabrication',
    });
    const nomDuFabricant = accessor.getStringValue('nomDuFabricant');
    const lieuDeFabrication = accessor.getStringValue('lieuDeFabrication');
    if (nomDuFabricant && lieuDeFabrication) {
      fournisseurs.push({
        typeFournisseur: 'module-ou-films',
        nomDuFabricant,
        lieuDeFabrication,
      });
    }
  }

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

  // Verre solaire
  for (const { champs } of rootAccessor.getRepetitionChamps('verreSolaire') ?? []) {
    const accessor = createDossierAccessor(champs, {
      nomDuFabricant: 'Verre solaire - Nom du fabricant',
      lieuDeFabrication: 'Verre solaire - Pays de fabrication',
    });
    const nomDuFabricant = accessor.getStringValue('nomDuFabricant');
    const lieuDeFabrication = accessor.getStringValue('lieuDeFabrication');
    if (nomDuFabricant && lieuDeFabrication) {
      fournisseurs.push({
        typeFournisseur: 'verre-solaire',
        nomDuFabricant,
        lieuDeFabrication,
      });
    }
  }

  // Lingot de silicium
  for (const { champs } of rootAccessor.getRepetitionChamps('lingotDeSilicium') ?? []) {
    const accessor = createDossierAccessor(champs, {
      nomDuFabricant: 'Lingot de silicium - Nom du fabricant',
      lieuDeFabrication: 'Lingot de silicium - Pays de fabrication',
    });
    const nomDuFabricant = accessor.getStringValue('nomDuFabricant');
    const lieuDeFabrication = accessor.getStringValue('lieuDeFabrication');
    if (nomDuFabricant && lieuDeFabrication) {
      fournisseurs.push({
        typeFournisseur: 'lingot-de-silicium',
        nomDuFabricant,
        lieuDeFabrication,
      });
    }
  }

  return fournisseurs;
};
