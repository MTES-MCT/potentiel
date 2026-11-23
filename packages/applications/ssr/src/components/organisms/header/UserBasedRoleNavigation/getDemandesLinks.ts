import { Routes } from '@potentiel-applications/routes';
import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { Lauréat } from '@potentiel-domain/projet';

import type { MenuItem } from './UserBasedRoleNavigation';

type TypeDeGarantiesFinancièresÀInstruire =
  keyof Lauréat.GarantiesFinancières.ConsulterNombreDeGarantiesFinancièresÀInstruireReadModel;

type GetDemandesLinksProps = {
  estPorteur: boolean;
  autorité: 'dgec' | 'dreal' | undefined;
  keys: DemandeMenuItem['domaine'][];
};

export type DemandeMenuItem = MenuItem &
  (
    | { domaine: AppelOffre.DomainesConcernésParMiseÀJour }
    | { domaine: 'garanties-financières'; type: TypeDeGarantiesFinancièresÀInstruire }
  );

export const getDemandesLinks = ({ estPorteur, autorité, keys }: GetDemandesLinksProps) => {
  const demandes: DemandeMenuItem[] = [
    {
      domaine: 'abandon',
      label: 'Abandon',
      url: Routes.Abandon.lister({
        statut: estPorteur
          ? ['demandé', 'en-instruction', 'confirmé', 'confirmation-demandée']
          : ['demandé', 'en-instruction', 'confirmé'],
        autorite: autorité,
      }),
      permission: 'abandon.lister.demandes',
    },

    {
      domaine: 'actionnaire',
      label: 'Actionnaire',
      url: Routes.Actionnaire.changement.lister({ statut: ['demandé'] }),
      permission: 'actionnaire.listerChangement',
    },

    {
      domaine: 'délai',
      label: 'Délai',
      url: Routes.Délai.lister({
        statut: ['demandé', 'en-instruction'],
        autorite: autorité,
      }),
      permission: 'délai.listerDemandes',
    },

    {
      domaine: 'dispositifDeStockage',
      label: 'Dispositif de stockage',
      url: Routes.Installation.changement.dispositifDeStockage.lister,
      permission: 'installation.dispositifDeStockage.listerChangement',
    },

    {
      domaine: 'fournisseur',
      label: 'Fournisseur',
      url: Routes.Fournisseur.changement.lister,
      permission: 'fournisseur.listerChangement',
    },

    {
      domaine: 'installateur',
      label: 'Installateur',
      url: Routes.Installation.changement.installateur.lister,
      permission: 'installation.installateur.listerChangement',
    },

    {
      domaine: 'natureDeLExploitation',
      label: "Nature de l'exploitation",
      url: Routes.NatureDeLExploitation.changement.lister,
      permission: 'natureDeLExploitation.listerChangement',
    },

    {
      domaine: 'nomProjet',
      label: 'Nom du projet',
      url: Routes.Lauréat.changement.nomProjet.lister,
      permission: 'nomProjet.listerChangement',
    },

    {
      domaine: 'puissance',
      label: 'Puissance',
      url: Routes.Puissance.changement.lister({
        statut: ['demandé'],
        autorite: autorité,
      }),
      permission: 'puissance.listerChangement',
    },

    {
      domaine: 'producteur',
      label: 'Producteur',
      url: Routes.Producteur.changement.lister,
      permission: 'producteur.listerChangement',
    },

    {
      domaine: 'recours',
      label: 'Recours',
      url: Routes.Recours.lister({ statut: ['demandé', 'en-instruction'] }),
      permission: 'recours.consulter.liste',
    },

    {
      domaine: 'représentantLégal',
      label: 'Représentant légal',
      url: Routes.ReprésentantLégal.changement.lister({ statut: ['demandé'] }),
      permission: 'représentantLégal.listerChangement',
    },

    {
      domaine: 'garanties-financières',
      type: 'dépôt',
      label: 'Garanties financières à valider',
      url: Routes.GarantiesFinancières.dépôt.lister(),
      permission: 'garantiesFinancières.dépôt.lister',
    },

    {
      domaine: 'garanties-financières',
      type: 'projetEnAttente',
      label: 'Projets sans garanties financières',
      url: Routes.GarantiesFinancières.enAttente.lister({ statut: 'actif' }),
      permission: 'garantiesFinancières.enAttente.lister',
    },

    {
      domaine: 'garanties-financières',
      type: 'demandeMainlevée',
      label: 'Demandes de mainlevée',
      url: Routes.GarantiesFinancières.demandeMainlevée.lister({
        statut: ['demandé', 'en-instruction'],
      }),
      permission: 'garantiesFinancières.mainlevée.lister',
    },
  ];

  return demandes.filter((item) => keys.includes(item.domaine));
};
