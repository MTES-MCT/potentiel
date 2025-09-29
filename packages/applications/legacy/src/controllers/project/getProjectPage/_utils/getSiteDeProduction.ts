import { Project } from '../../../../entities';
import { Routes } from '@potentiel-applications/routes';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { ProjectDataForProjectPage } from '../../../../modules/project';

export type GetSiteDeProductionForProjectPage = {
  localité: Candidature.Localité.RawType;
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
};

export const getSiteDeProduction = ({
  identifiantProjet,
  rôle,
  project,
}: Props): GetSiteDeProductionForProjectPage => ({
  localité: {
    adresse1: project.adresseProjet.split('\n')[0] || '',
    adresse2: project.adresseProjet.split('\n')[1],
    codePostal: project.codePostalProjet,
    commune: project.communeProjet,
    département: project.departementProjet,
    région: project.regionProjet,
  },
  affichage: rôle.aLaPermission('lauréat.modifierSiteDeProduction')
    ? {
        url: Routes.Lauréat.modifierSiteDeProduction(identifiantProjet.formatter()),
        label: 'Modifier',
        labelActions: 'Modifier le site de production',
      }
    : undefined,
});
