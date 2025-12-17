import { Role } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getCahierDesCharges } from '../../../_helpers';

import { peutEffectuerUnChangement } from './peutEffectuerUnChangement';

type OptionsChangement = {
  url: (identifiantProjet: string) => string;
  label: string;
  labelActions: string;
  permission: Role.Policy;
};

type Props<TDomain extends keyof AppelOffre.RèglesDemandesChangement> = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
  domain: TDomain;
  /** Forcer l'instruction, utile quand le domaine a une règle complexe (actionnaire)  */
  nécessiteInstruction?: boolean;
};

type TypeChangement = 'modifier' | 'demanderChangement' | 'enregistrerChangement';
type MapChangements = Record<
  keyof AppelOffre.RèglesDemandesChangement,
  Partial<Record<TypeChangement, OptionsChangement>>
>;
const mapChangements: MapChangements = {
  fournisseur: {
    modifier: {
      permission: 'fournisseur.modifier',
      url: Routes.Fournisseur.modifier,
      label: 'Modifier',
      labelActions: 'Modifier le fournisseur',
    },
    enregistrerChangement: {
      permission: 'fournisseur.enregistrerChangement',
      url: Routes.Fournisseur.changement.enregistrer,
      label: 'Changer de fournisseur',
      labelActions: 'Changer de fournisseur',
    },
  },
  producteur: {
    modifier: {
      url: Routes.Producteur.modifier,
      label: 'Modifier',
      labelActions: 'Modifier le producteur',
      permission: 'producteur.modifier',
    },
    enregistrerChangement: {
      url: Routes.Producteur.changement.enregistrer,
      label: 'Changer de producteur',
      labelActions: 'Changer de producteur',
      permission: 'producteur.enregistrerChangement',
    },
  },
  représentantLégal: {
    modifier: {
      url: Routes.ReprésentantLégal.modifier,
      label: 'Modifier',
      labelActions: 'Modifier le représentant légal',
      permission: 'représentantLégal.modifier',
    },
    demanderChangement: {
      url: Routes.ReprésentantLégal.changement.demander,
      label: 'Changer de représentant légal',
      labelActions: 'Changer de représentant légal',
      permission: 'représentantLégal.demanderChangement',
    },
    enregistrerChangement: {
      url: Routes.ReprésentantLégal.changement.enregistrer,
      label: 'Changer de représentant légal',
      labelActions: 'Changer de représentant légal',
      permission: 'représentantLégal.enregistrerChangement',
    },
  },
  dispositifDeStockage: {
    modifier: {
      url: Routes.Installation.modifierDispositifDeStockage,
      label: 'Modifier le dispositif de stockage',
      labelActions: 'Modifier le dispositif de stockage',
      permission: 'installation.dispositifDeStockage.modifier',
    },
    enregistrerChangement: {
      url: Routes.Installation.changement.dispositifDeStockage.enregistrer,
      label: 'Changer le dispositif de stockage',
      labelActions: 'Changer le dispositif de stockage',
      permission: 'installation.dispositifDeStockage.enregistrerChangement',
    },
  },
  installateur: {
    modifier: {
      url: Routes.Installation.modifierInstallateur,
      label: "Modifier l'installateur",
      labelActions: "Modifier l'installateur",
      permission: 'installation.installateur.modifier',
    },
    enregistrerChangement: {
      url: Routes.Installation.changement.installateur.enregistrer,
      label: "Changer l'installateur",
      labelActions: "Changer l'installateur",
      permission: 'installation.installateur.enregistrerChangement',
    },
  },
  natureDeLExploitation: {
    modifier: {
      permission: 'natureDeLExploitation.modifier',
      url: Routes.NatureDeLExploitation.modifier,
      label: 'Modifier',
      labelActions: "Modifier la nature de l'exploitation",
    },
    enregistrerChangement: {
      permission: 'natureDeLExploitation.enregistrerChangement',
      url: Routes.NatureDeLExploitation.changement.enregistrer,
      label: "Changer la nature de l'exploitation",
      labelActions: "Changer la nature de l'exploitation",
    },
  },
  actionnaire: {
    modifier: {
      url: Routes.Actionnaire.modifier,
      label: 'Modifier',
      labelActions: `Modifier l'actionnaire(s)`,
      permission: 'actionnaire.modifier',
    },
    demanderChangement: {
      url: Routes.Actionnaire.changement.demander,
      label: 'Faire une demande de changement',
      labelActions: `Demander un changement d'actionnaire(s)`,
      permission: 'actionnaire.demanderChangement',
    },
    enregistrerChangement: {
      url: Routes.Actionnaire.changement.enregistrer,
      label: 'Faire un changement',
      labelActions: "Changer d'actionnaire(s)",
      permission: 'actionnaire.enregistrerChangement',
    },
  },
  puissance: {
    modifier: {
      url: Routes.Puissance.modifier,
      label: 'Modifier',
      labelActions: `Modifier la puissance`,
      permission: 'puissance.modifier',
    },
    demanderChangement: {
      url: Routes.Puissance.changement.demander,
      label: 'Changer de puissance',
      labelActions: `Changer de puissance`,
      permission: 'puissance.demanderChangement',
    },
  },
  // TODO
  recours: {},
  abandon: {},
  délai: {},
  nomProjet: {},
};

export const getAction = async <TDomain extends keyof AppelOffre.RèglesDemandesChangement>({
  identifiantProjet,
  rôle,
  domain,
  nécessiteInstruction,
}: Props<TDomain>) => {
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

  const règlesChangement = cahierDesCharges.getRèglesChangements(domain);
  if (!règlesChangement.demande && !règlesChangement.informationEnregistrée) {
    return undefined;
  }

  const { modifier, demanderChangement, enregistrerChangement } = mapChangements[domain];

  if (!!modifier && rôle.aLaPermission(modifier.permission)) {
    return {
      url: modifier.url(identifiantProjet.formatter()),
      label: modifier.label,
      labelActions: modifier.labelActions,
    };
  }

  const changementPossible = await peutEffectuerUnChangement(identifiantProjet);
  if (!changementPossible) {
    return;
  }

  if (
    !!enregistrerChangement &&
    !nécessiteInstruction &&
    rôle.aLaPermission(enregistrerChangement.permission) &&
    règlesChangement.informationEnregistrée
  ) {
    return {
      url: enregistrerChangement.url(identifiantProjet.formatter()),
      label: enregistrerChangement.label,
      labelActions: enregistrerChangement.labelActions,
    };
  }

  if (
    !!demanderChangement &&
    rôle.aLaPermission(demanderChangement.permission) &&
    règlesChangement.demande
  ) {
    return {
      url: demanderChangement.url(identifiantProjet.formatter()),
      label: demanderChangement.label,
      labelActions: demanderChangement.labelActions,
    };
  }
};
