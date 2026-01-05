import { SideMenuProps } from '@codegouvfr/react-dsfr/SideMenu';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { getCahierDesCharges } from '@/app/_helpers';

import { BadgeTâches } from '../(components)/BadgeTâches';
import { DomaineAction, getAction, getLauréatInfos } from '../../_helpers';

export type MenuItem = SideMenuProps.Item;

type GetLauréatMenuItemsProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  utilisateur: Utilisateur.ValueType;
};

const domainesMap: Record<DomaineAction, boolean> = {
  actionnaire: true,
  délai: true,
  dispositifDeStockage: true,
  fournisseur: true,
  installateur: true,
  natureDeLExploitation: true,
  nomProjet: true,
  producteur: true,
  puissance: true,
  représentantLégal: true,
  siteDeProduction: true,
  abandon: true,
  // non utilisé pour lauréat
  recours: false,
};
const domaines = Object.keys(domainesMap) as DomaineAction[];

export const getLauréatMenuItems = async ({
  identifiantProjet,
  utilisateur,
}: GetLauréatMenuItemsProps): Promise<SideMenuProps.Item[]> => {
  const link = (text: string, href: string) => ({ linkProps: { href }, text });
  const linkToSection = (text: string, path: string) =>
    link(text, `${Routes.Lauréat.détails(identifiantProjet.formatter())}/${path}`);
  const linkToAction = async (domain: DomaineAction) => {
    const action = await getAction({
      domain,
      identifiantProjet,
      rôle: utilisateur.rôle,
    });
    return action ? link(action.labelActions, action.url) : undefined;
  };

  const tâchesMenu = utilisateur.rôle.aLaPermission('tâche.consulter')
    ? {
        ...linkToSection(utilisateur.rôle.estPorteur() ? 'Tâches' : 'Tâches porteur', 'taches'),
        text: (
          <BadgeTâches identifiantProjet={identifiantProjet} utilisateur={utilisateur}>
            Tâches
          </BadgeTâches>
        ),
      }
    : undefined;

  const lauréat = await getLauréatInfos(identifiantProjet.formatter());
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());
  const champsSupplémentaires = cahierDesCharges.getChampsSupplémentaires();
  const afficherInstallation = !!(
    champsSupplémentaires.installateur ||
    champsSupplémentaires.dispositifDeStockage ||
    champsSupplémentaires.natureDeLExploitation ||
    champsSupplémentaires.typologieInstallation ||
    champsSupplémentaires.autorisationDUrbanisme
  );
  const installationMenu = afficherInstallation
    ? linkToSection('Installation', 'installation')
    : undefined;

  const actionsDomaine = await Promise.all(domaines.map(linkToAction));

  const utilisateursMenu = utilisateur.rôle.aLaPermission('accès.lister')
    ? linkToSection('Utilisateurs', 'utilisateurs')
    : undefined;

  const modifierLauréatOnglet = utilisateur.rôle.aLaPermission('lauréat.modifier')
    ? linkToSection('Modifier le projet', 'modifier')
    : undefined;
  const transmettreAttestationOnglet =
    utilisateur.rôle.aLaPermission('achèvement.transmettreAttestation') && lauréat.statut.estActif()
      ? linkToSection(
          "Transmettre l'attestation de conformité",
          'achevement/attestation-conformite:transmettre',
        )
      : undefined;
  const modifications = [
    modifierLauréatOnglet,
    transmettreAttestationOnglet,
    ...actionsDomaine,
  ].filter((item) => !!item);
  const modificationMenu =
    modifications.length > 0
      ? {
          text: 'Modification',
          items: modifications,
        }
      : undefined;

  return [
    linkToSection('Tableau de bord', ''),
    {
      text: 'Détails du projet',
      items: [
        linkToSection('Informations générales', 'informations-generales'),
        linkToSection('Évaluation carbone', 'evaluation-carbone'),
        installationMenu,
      ].filter((item) => !!item),
    },
    modificationMenu,
    tâchesMenu,
    linkToSection('Historique', 'historique'),
    utilisateursMenu,
    // seulement pour porteur, admin et dreal
    // est ce nécessaire de restreindre pour les autres rôles ?
    linkToSection('Imprimer la page', 'imprimer'),
  ].filter((item) => !!item);
};
