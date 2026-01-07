import { Routes } from '@potentiel-applications/routes';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Role } from '@potentiel-domain/utilisateur';

type OptionsChangement = {
  url: (identifiantProjet: string) => string;
  label: string;
  labelMenu: string;
  permission: Role.Policy;
};

type TypeChangement = 'modifier' | 'demanderChangement' | 'enregistrerChangement';

export type MapChangements = Record<
  AppelOffre.DomainesConcernésParChangement,
  Partial<Record<TypeChangement, OptionsChangement>> & {
    champSupplémentaire?: AppelOffre.ChampCandidature;
  }
>;

export const mapChangements: MapChangements = {
  fournisseur: {
    modifier: {
      permission: 'fournisseur.modifier',
      url: Routes.Fournisseur.modifier,
      label: 'Modifier le(s) fournisseur(s)',
      labelMenu: 'Fournisseur',
    },
    enregistrerChangement: {
      permission: 'fournisseur.enregistrerChangement',
      url: Routes.Fournisseur.changement.enregistrer,
      label: 'Changer de fournisseur',
      labelMenu: 'Fournisseur',
    },
  },
  producteur: {
    modifier: {
      permission: 'producteur.modifier',
      url: Routes.Producteur.modifier,
      label: 'Modifier le producteur',
      labelMenu: 'Producteur',
    },
    enregistrerChangement: {
      permission: 'producteur.enregistrerChangement',
      url: Routes.Producteur.changement.enregistrer,
      label: 'Changer de producteur',
      labelMenu: 'Producteur',
    },
  },
  représentantLégal: {
    modifier: {
      permission: 'représentantLégal.modifier',
      url: Routes.ReprésentantLégal.modifier,
      label: 'Modifier le représentant légal',
      labelMenu: 'Représentant légal',
    },
    demanderChangement: {
      permission: 'représentantLégal.demanderChangement',
      url: Routes.ReprésentantLégal.changement.demander,
      label: 'Changer de représentant légal',
      labelMenu: 'Représentant légal',
    },
    enregistrerChangement: {
      permission: 'représentantLégal.enregistrerChangement',
      url: Routes.ReprésentantLégal.changement.enregistrer,
      label: 'Changer de représentant légal',
      labelMenu: 'Représentant légal',
    },
  },
  dispositifDeStockage: {
    modifier: {
      permission: 'installation.dispositifDeStockage.modifier',
      url: Routes.Installation.modifierDispositifDeStockage,
      label: 'Modifier le dispositif de stockage',
      labelMenu: 'Dispositif de stockage',
    },
    enregistrerChangement: {
      permission: 'installation.dispositifDeStockage.enregistrerChangement',
      url: Routes.Installation.changement.dispositifDeStockage.enregistrer,
      label: 'Changer le dispositif de stockage',
      labelMenu: 'Dispositif de stockage',
    },
    champSupplémentaire: 'dispositifDeStockage',
  },
  installateur: {
    modifier: {
      permission: 'installation.installateur.modifier',
      url: Routes.Installation.modifierInstallateur,
      label: "Modifier l'installateur",
      labelMenu: 'Installateur',
    },
    enregistrerChangement: {
      permission: 'installation.installateur.enregistrerChangement',
      url: Routes.Installation.changement.installateur.enregistrer,
      label: "Changer l'installateur",
      labelMenu: 'Installateur',
    },
    champSupplémentaire: 'installateur',
  },
  natureDeLExploitation: {
    modifier: {
      permission: 'natureDeLExploitation.modifier',
      url: Routes.NatureDeLExploitation.modifier,
      label: "Modifier la nature de l'exploitation",
      labelMenu: "Nature de l'exploitation",
    },
    enregistrerChangement: {
      permission: 'natureDeLExploitation.enregistrerChangement',
      url: Routes.NatureDeLExploitation.changement.enregistrer,
      label: "Changer la nature de l'exploitation",
      labelMenu: "Nature de l'exploitation",
    },
    champSupplémentaire: 'natureDeLExploitation',
  },
  typologieInstallation: {
    modifier: {
      permission: 'installation.typologieInstallation.modifier',
      url: Routes.Installation.modifierTypologie,
      label: 'Modifier la typologie du projet',
      labelMenu: 'Typologie du projet',
    },
    champSupplémentaire: 'typologieInstallation',
  },
  actionnaire: {
    modifier: {
      permission: 'actionnaire.modifier',
      url: Routes.Actionnaire.modifier,
      label: "Modifier l'actionnaire",
      labelMenu: `Actionnaire(s)`,
    },
    demanderChangement: {
      permission: 'actionnaire.demanderChangement',
      url: Routes.Actionnaire.changement.demander,
      label: 'Faire une demande de changement',
      labelMenu: `Actionnaire(s)`,
    },
    enregistrerChangement: {
      permission: 'actionnaire.enregistrerChangement',
      url: Routes.Actionnaire.changement.enregistrer,
      label: 'Faire un changement',
      labelMenu: 'Actionnaire(s)',
    },
  },
  puissance: {
    modifier: {
      permission: 'puissance.modifier',
      url: Routes.Puissance.modifier,
      label: 'Modifier la puissance',
      labelMenu: `Puissance`,
    },
    demanderChangement: {
      permission: 'puissance.demanderChangement',
      url: Routes.Puissance.changement.demander,
      label: 'Changer de puissance',
      labelMenu: 'Puissance',
    },
  },
  nomProjet: {
    modifier: {
      permission: 'nomProjet.modifier',
      url: Routes.Lauréat.modifierNomProjet,
      label: 'Modifier le nom du projet',
      labelMenu: 'Nom du projet',
    },
    enregistrerChangement: {
      permission: 'nomProjet.enregistrerChangement',
      url: Routes.Lauréat.changement.nomProjet.enregistrer,
      label: 'Changer le nom du projet',
      labelMenu: 'Nom du projet',
    },
  },
  siteDeProduction: {
    modifier: {
      permission: 'lauréat.modifierSiteDeProduction',
      url: Routes.Lauréat.modifierSiteDeProduction,
      label: 'Modifier le site de production',
      labelMenu: 'Site de production',
    },
  },
  abandon: {
    demanderChangement: {
      label: "Demander l'abandon",
      labelMenu: "Demander l'abandon",
      url: Routes.Abandon.demander,
      permission: 'abandon.demander',
    },
  },
  délai: {
    demanderChangement: {
      label: 'Demander un délai',
      labelMenu: 'Demander un délai',
      url: Routes.Délai.demander,
      permission: 'délai.demander',
    },
  },
  recours: {},
};
