import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { ProjectDataForProjectPage } from '../../../../modules/project';

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
  // TODO: migration page projet, se baser sur la valeur lauréat
  project: ProjectDataForProjectPage;
};

export const getNomProjet = ({
  identifiantProjet,
  rôle,
  project,
  // viovio ajouter ici le check sur l'AO
}: Props): GetNomProjetForProjectPage => ({
  nom: project.nomProjet,
  affichage: rôle.aLaPermission('lauréat.nomProjet.enregistrerChangement')
    ? {
        url: Routes.Lauréat.changementNomProjet(identifiantProjet.formatter()),
        label: 'Changer',
        labelActions: 'Changer le nom du projet',
      }
    : undefined,
});
