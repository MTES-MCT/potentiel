import { Routes } from '@potentiel-applications/routes';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Role } from '@potentiel-domain/utilisateur';
import { DomaineAction } from './getAction';

type OptionsChangement = {
  url: (identifiantProjet: string) => string;
  label: string;
  labelActions: string;
  permission: Role.Policy;
};

type TypeChangement = 'modifier' | 'demanderChangement' | 'enregistrerChangement';

export type MapChangements = Record<
  DomaineAction,
  Partial<Record<TypeChangement, OptionsChangement>> & {
    champSupplémentaire?: AppelOffre.ChampCandidature;
  }
>;

export const mapChangements: MapChangements = {
  fournisseur: {
    modifier: {
      permission: 'fournisseur.modifier',
      url: Routes.Fournisseur.modifier,
      label: 'Modifier',
      labelActions: 'Fournisseur',
    },
    enregistrerChangement: {
      permission: 'fournisseur.enregistrerChangement',
      url: Routes.Fournisseur.changement.enregistrer,
      label: 'Changer de fournisseur',
      labelActions: 'Fournisseur',
    },
  },
  producteur: {
    modifier: {
      permission: 'producteur.modifier',
      url: Routes.Producteur.modifier,
      label: 'Modifier',
      labelActions: 'Producteur',
    },
    enregistrerChangement: {
      permission: 'producteur.enregistrerChangement',
      url: Routes.Producteur.changement.enregistrer,
      label: 'Changer de producteur',
      labelActions: 'Producteur',
    },
  },
  représentantLégal: {
    modifier: {
      permission: 'représentantLégal.modifier',
      url: Routes.ReprésentantLégal.modifier,
      label: 'Modifier',
      labelActions: 'Représentant légal',
    },
    demanderChangement: {
      permission: 'représentantLégal.demanderChangement',
      url: Routes.ReprésentantLégal.changement.demander,
      label: 'Changer de représentant légal',
      labelActions: 'Représentant légal',
    },
    enregistrerChangement: {
      permission: 'représentantLégal.enregistrerChangement',
      url: Routes.ReprésentantLégal.changement.enregistrer,
      label: 'Changer de représentant légal',
      labelActions: 'Représentant légal',
    },
  },
  dispositifDeStockage: {
    modifier: {
      permission: 'installation.dispositifDeStockage.modifier',
      url: Routes.Installation.modifierDispositifDeStockage,
      label: 'Modifier le dispositif de stockage',
      labelActions: 'Dispositif de stockage',
    },
    enregistrerChangement: {
      permission: 'installation.dispositifDeStockage.enregistrerChangement',
      url: Routes.Installation.changement.dispositifDeStockage.enregistrer,
      label: 'Changer le dispositif de stockage',
      labelActions: 'Dispositif de stockage',
    },
    champSupplémentaire: 'dispositifDeStockage',
  },
  installateur: {
    modifier: {
      permission: 'installation.installateur.modifier',
      url: Routes.Installation.modifierInstallateur,
      label: "Modifier l'installateur",
      labelActions: 'Installateur',
    },
    enregistrerChangement: {
      permission: 'installation.installateur.enregistrerChangement',
      url: Routes.Installation.changement.installateur.enregistrer,
      label: "Changer l'installateur",
      labelActions: 'Installateur',
    },
    champSupplémentaire: 'installateur',
  },
  natureDeLExploitation: {
    modifier: {
      permission: 'natureDeLExploitation.modifier',
      url: Routes.NatureDeLExploitation.modifier,
      label: 'Modifier',
      labelActions: "Nature de l'exploitation",
    },
    enregistrerChangement: {
      permission: 'natureDeLExploitation.enregistrerChangement',
      url: Routes.NatureDeLExploitation.changement.enregistrer,
      label: "Changer la nature de l'exploitation",
      labelActions: "Nature de l'exploitation",
    },
    champSupplémentaire: 'natureDeLExploitation',
  },
  actionnaire: {
    modifier: {
      permission: 'actionnaire.modifier',
      url: Routes.Actionnaire.modifier,
      label: 'Modifier',
      labelActions: `Actionnaire(s)`,
    },
    demanderChangement: {
      permission: 'actionnaire.demanderChangement',
      url: Routes.Actionnaire.changement.demander,
      label: 'Faire une demande de changement',
      labelActions: `Actionnaire(s)`,
    },
    enregistrerChangement: {
      permission: 'actionnaire.enregistrerChangement',
      url: Routes.Actionnaire.changement.enregistrer,
      label: 'Faire un changement',
      labelActions: 'Actionnaire(s)',
    },
  },
  puissance: {
    modifier: {
      permission: 'puissance.modifier',
      url: Routes.Puissance.modifier,
      label: 'Modifier',
      labelActions: `Puissance`,
    },
    demanderChangement: {
      permission: 'puissance.demanderChangement',
      url: Routes.Puissance.changement.demander,
      label: 'Changer de puissance',
      labelActions: 'Puissance',
    },
  },
  nomProjet: {
    modifier: {
      permission: 'nomProjet.modifier',
      url: Routes.Lauréat.modifierNomProjet,
      label: 'Modifier',
      labelActions: 'Nom du projet',
    },
    enregistrerChangement: {
      permission: 'nomProjet.enregistrerChangement',
      url: Routes.Lauréat.changement.nomProjet.enregistrer,
      label: 'Changer le nom du projet',
      labelActions: 'Nom du projet',
    },
  },
  siteDeProduction: {
    modifier: {
      permission: 'lauréat.modifierSiteDeProduction',
      url: Routes.Lauréat.modifierSiteDeProduction,
      label: 'Modifier',
      labelActions: 'Site de production',
    },
  },
  abandon: {
    demanderChangement: {
      label: "Demander l'abandon",
      labelActions: "Demander l'abandon",
      url: Routes.Abandon.demander,
      permission: 'abandon.demander',
    },
  },
  délai: {
    demanderChangement: {
      label: 'Demander un délai',
      labelActions: 'Demander un délai',
      url: Routes.Délai.demander,
      permission: 'délai.demander',
    },
  },
  recours: {},
};
