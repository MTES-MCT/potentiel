import { Routes } from '@potentiel-applications/routes';

import type { MenuItem } from './UserBasedRoleNavigation';

type getDemandesLinksProps = {
  estPorteur: boolean;
  autorité: 'dgec' | 'dreal' | undefined;
  keys: string[];
};

export const getDemandesLinks = ({ estPorteur, autorité, keys }: getDemandesLinksProps) => {
  const record: Record<string, MenuItem> = {
    abandon: {
      label: 'Abandon',
      url: Routes.Abandon.lister({
        statut: estPorteur
          ? ['demandé', 'en-instruction', 'confirmé', 'confirmation-demandée']
          : ['demandé', 'en-instruction', 'confirmé'],
        autorite: autorité,
      }),
      permission: 'abandon.lister.demandes',
    },
    actionnaire: {
      label: 'Actionnaire',
      url: Routes.Actionnaire.changement.lister({ statut: ['demandé'] }),
      permission: 'actionnaire.listerChangement',
    },
    délai: {
      label: 'Délai',
      url: Routes.Délai.lister({
        statut: ['demandé', 'en-instruction'],
        autoriteCompetente: autorité,
      }),
      permission: 'délai.listerDemandes',
    },
    dispositifDeStockage: {
      label: 'Dispositif de stockage',
      url: Routes.Installation.changement.dispositifDeStockage.lister,
      permission: 'installation.dispositifDeStockage.listerChangement',
    },
    fournisseur: {
      label: 'Fournisseur',
      url: Routes.Fournisseur.changement.lister,
      permission: 'fournisseur.listerChangement',
    },
    installateur: {
      label: 'Installateur',
      url: Routes.Installation.changement.installateur.lister,
      permission: 'installation.installateur.listerChangement',
    },
    natureDeLExploitation: {
      label: "Nature de l'exploitation",
      url: Routes.NatureDeLExploitation.changement.lister,
      permission: 'natureDeLExploitation.listerChangement',
    },
    nomProjet: {
      label: 'Nom du projet',
      url: Routes.Lauréat.changement.nomProjet.lister,
      permission: 'nomProjet.listerChangement',
    },
    puissance: {
      label: 'Puissance',
      url: Routes.Puissance.changement.lister({ statut: ['demandé'] }),
      permission: 'puissance.listerChangement',
    },
    producteur: {
      label: 'Producteur',
      url: Routes.Producteur.changement.lister,
      permission: 'producteur.listerChangement',
    },
    recours: {
      label: 'Recours',
      url: Routes.Recours.lister({ statut: ['demandé', 'en-instruction'] }),
      permission: 'recours.consulter.liste',
    },
    représentantLégal: {
      label: 'Représentant légal',
      url: Routes.ReprésentantLégal.changement.lister({ statut: ['demandé'] }),
      permission: 'représentantLégal.listerChangement',
    },
  };

  return keys.map((key) => record[key] ?? null).filter((item) => item !== null);
};
