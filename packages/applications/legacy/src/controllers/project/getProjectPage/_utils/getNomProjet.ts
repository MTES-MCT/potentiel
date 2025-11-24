import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { ProjectDataForProjectPage } from '../../../../modules/project';
import { checkAutorisationChangement } from './checkLauréat/checkAutorisationChangement';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export type GetNomProjetForProjectPage = {
  nom: string;
  affichage?: {
    labelActions: string;
    label: string;
    url: string;
  };
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
  project: ProjectDataForProjectPage;
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement['nomProjet'];
  aUnAbandonEnCours: boolean;
  estAbandonné: boolean;
  estAchevé: boolean;
};

export const getNomProjet = async ({
  identifiantProjet,
  rôle,
  project,
  règlesChangementPourAppelOffres,
  aUnAbandonEnCours,
  estAbandonné,
  estAchevé,
}: Props): Promise<GetNomProjetForProjectPage> => {
  const { peutEnregistrerChangement, peutModifier } =
    await checkAutorisationChangement<'nomProjet'>({
      rôle,
      aUnAbandonEnCours,
      estAbandonné,
      estAchevé,
      règlesChangementPourAppelOffres,
      domain: 'nomProjet',
    });

  return {
    nom: project.nomProjet,
    affichage: peutModifier
      ? {
          url: Routes.Lauréat.modifierNomProjet(identifiantProjet.formatter()),
          label: 'Modifier',
          labelActions: 'Modifier le nom du projet',
        }
      : peutEnregistrerChangement
        ? {
            url: Routes.Lauréat.changement.nomProjet.enregistrer(identifiantProjet.formatter()),
            label: 'Changer le nom du projet',
            labelActions: 'Changer le nom du projet',
          }
        : undefined,
  };
};
