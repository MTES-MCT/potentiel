import { SideMenuProps } from '@codegouvfr/react-dsfr/SideMenu';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { getCahierDesCharges } from '@/app/_helpers';

import { BadgeTâches } from '../(components)/BadgeTâches';
import { getAction, getLauréatInfos } from '../../_helpers';
import { changementActionnaireNécessiteInstruction } from '../../../../_helpers/changementActionnaireNécessiteInstruction';

export type MenuItem = SideMenuProps.Item;

type GetLauréatMenuItemsProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  utilisateur: Utilisateur.ValueType;
};

const domainesMap: Record<AppelOffre.DomainesConcernésParChangement, boolean> = {
  actionnaire: true,
  délai: true,
  dispositifDeStockage: true,
  fournisseur: true,
  installateur: true,
  natureDeLExploitation: true,
  typologieInstallation: true,
  nomProjet: true,
  producteur: true,
  puissance: true,
  représentantLégal: true,
  siteDeProduction: true,
  abandon: true,
  // non utilisé pour lauréat
  recours: false,
};
const domaines = Object.keys(domainesMap) as AppelOffre.DomainesConcernésParChangement[];

export const getLauréatMenuItems = async ({
  identifiantProjet,
  utilisateur,
}: GetLauréatMenuItemsProps): Promise<SideMenuProps.Item[]> => {
  const link = (text: string, href: string) => ({ linkProps: { href }, text });
  const linkToSection = (text: string, path: string) =>
    link(text, `${Routes.Lauréat.détails.tableauDeBord(identifiantProjet.formatter())}/${path}`);
  const linkToAction = async (domain: AppelOffre.DomainesConcernésParChangement) => {
    const nécessiteInstruction =
      domain === 'actionnaire' && utilisateur.rôle.aLaPermission('actionnaire.demanderChangement')
        ? await changementActionnaireNécessiteInstruction(identifiantProjet.formatter())
        : undefined;
    const action = await getAction({
      domain,
      identifiantProjet,
      rôle: utilisateur.rôle,
      nécessiteInstruction,
    });
    return action ? link(action.labelMenu, action.url) : undefined;
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

  const utilisateursMenu = utilisateur.rôle.aLaPermission('accès.consulter')
    ? linkToSection('Utilisateurs', 'utilisateurs')
    : undefined;

  const achèvementOnglet =
    utilisateur.rôle.aLaPermission('achèvement.transmettreAttestation') && lauréat.statut.estActif()
      ? linkToSection('Attestation de conformité', 'achevement/attestation-conformite:transmettre')
      : utilisateur.rôle.aLaPermission('achèvement.transmettreDate') && lauréat.statut.estActif()
        ? linkToSection("Date d'achèvement", 'achevement/date-achevement:transmettre')
        : utilisateur.rôle.aLaPermission('achèvement.modifier') && lauréat.statut.estAchevé()
          ? linkToSection('Attestation de conformité', 'achevement/attestation-conformite:modifier')
          : undefined;

  const modifierLauréatOnglet = utilisateur.rôle.aLaPermission('lauréat.modifier')
    ? linkToSection('Modifier le projet', 'modifier')
    : undefined;

  const modifications = [modifierLauréatOnglet, achèvementOnglet, ...actionsDomaine].filter(
    (item) => !!item,
  );
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
    linkToSection('Imprimer la page', 'imprimer'),
  ].filter((item) => !!item);
};
