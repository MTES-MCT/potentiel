import { DropdownMenu } from '../../molecules/dropdowns/DropdownMenu';
import { Routes } from '@potentiel-applications/routes';
import { MenuLegacyGarantiesFinancières } from './_utils/garantiesFinancières.menuLegacy';
import { MenuLegacyProjet } from './_utils/projet.menuLegacy';

export const AdminMenuLegacy = (
  <>
    <MenuLegacyProjet />
    <DropdownMenu buttonChildren={'Demandes'}>
      <DropdownMenu.DropdownItem
        href={Routes.Abandon.lister({
          statut: ['demandé', 'en-instruction', 'confirmé'],
          autorite: 'dgec',
        })}
      >
        Abandon
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Recours.lister({ statut: ['demandé', 'en-instruction'] })}
      >
        Recours
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.ReprésentantLégal.changement.lister({ statut: ['demandé'] })}
      >
        Représentant légal
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Actionnaire.changement.lister({ statut: ['demandé'] })}
      >
        Actionnaire
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Puissance.changement.lister({
          statut: ['demandé'],
        })}
      >
        Puissance
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Producteur.changement.lister}>
        Producteur
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Fournisseur.changement.lister}>
        Fournisseur
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Délai.lister({
          statut: ['demandé', 'en-instruction'],
          autoriteCompetente: 'dgec',
        })}
      >
        Délai
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <MenuLegacyGarantiesFinancières />
    <DropdownMenu buttonChildren={'Candidatures'}>
      <DropdownMenu.DropdownItem href={Routes.Candidature.importer}>
        Nouveaux candidats
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Période.lister({
          statut: 'a-notifier',
        })}
      >
        Candidats à notifier
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Candidature.corrigerParLot}>
        Correction par lot
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Candidature.lister({
          estNotifié: false,
        })}
      >
        Tous les candidats
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <DropdownMenu buttonChildren={'Raccordements'}>
      <DropdownMenu.DropdownItem href={Routes.Raccordement.lister}>
        Tous les dossiers de raccordement
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Raccordement.importer}>
        Importer des dates de mise en service
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Raccordement.corrigerRéférencesDossier}>
        Corriger des références dossier
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <DropdownMenu buttonChildren={'Gestion des accès'}>
      <DropdownMenu.DropdownItem href={Routes.Utilisateur.lister({ actif: true })}>
        Utilisateurs
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Utilisateur.inviter}>
        Inviter un utilisateur
      </DropdownMenu.DropdownItem>
    </DropdownMenu>

    <DropdownMenu buttonChildren={'Outils'}>
      <DropdownMenu.DropdownItem href={'https://potentiel.e2.rie.gouv.fr/'} externe>
        Tableau de bord
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Gestionnaire.lister}>
        Gérer les gestionnaires de réseau
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
  </>
);
