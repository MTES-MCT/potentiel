import React from 'react';
import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { ProjectDataForProjectPage } from '../../../../modules/project/queries';
import { Heading1 } from '../../../components';
import { ProjectActions } from './ProjectActions';
import { ProjectHeaderBadge } from './ProjectHeaderBadge';
import {
  GetActionnaireAffichageForProjectPage,
  GetInstallationAvecDispositifDeStockageForProjectPage,
  GetNatureDeLExploitationForProjectPage,
  GetReprésentantLégalForProjectPage,
} from '../../../../controllers/project/getProjectPage/_utils';
import { GetPuissanceForProjectPage } from '../../../../controllers/project/getProjectPage/_utils/getPuissance';
import { GetProducteurForProjectPage } from '../../../../controllers/project/getProjectPage/_utils/getProducteur';
import { GetFournisseurForProjectPage } from '../../../../controllers/project/getProjectPage/_utils/getFournisseur';
import { GetInstallateurForProjectPage } from '../../../../controllers/project/getProjectPage/_utils/getInstallateur';

export type ProjectHeaderProps = {
  project: ProjectDataForProjectPage;
  user: UtilisateurReadModel;
  abandonEnCoursOuAccordé: boolean;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  modificationsNonPermisesParLeCDCActuel: boolean;
  estAchevé: boolean;
  représentantLégalAffichage?: GetReprésentantLégalForProjectPage['affichage'];
  puissanceAffichage?: GetPuissanceForProjectPage['affichage'];
  producteurAffichage?: GetProducteurForProjectPage['affichage'];
  actionnaireAffichage?: GetActionnaireAffichageForProjectPage;
  fournisseurAffichage?: GetFournisseurForProjectPage['affichage'];
  installateurAffichage?: GetInstallateurForProjectPage['affichage'];
  installationAvecDispositifDeStockageAffichage?: GetInstallationAvecDispositifDeStockageForProjectPage['affichage'];
  natureDeLExploitationAffichage?: GetNatureDeLExploitationForProjectPage['affichage'];
  délaiAffichage?: {
    label?: string;
    labelActions: string;
    url: string;
  };
  features: Array<string>;
};

export const ProjectHeader = ({
  project,
  user,
  abandonEnCoursOuAccordé,
  demandeRecours,
  modificationsNonPermisesParLeCDCActuel,
  estAchevé,
  représentantLégalAffichage,
  puissanceAffichage,
  actionnaireAffichage,
  producteurAffichage,
  fournisseurAffichage,
  installateurAffichage,
  délaiAffichage,
  installationAvecDispositifDeStockageAffichage,
  natureDeLExploitationAffichage,
}: ProjectHeaderProps) => (
  <div className="w-full pt-3 md:pt-0 print:pt-0 lg:flex justify-between gap-2">
    <div className="pl-3 print:pl-0 mb-3 text-sm">
      <div className="flex md:flex-row flex-col justify-start md:items-end gap-4">
        <Heading1 className="mb-0 pb-0">
          <div className="inline-block leading-10">{project.nomProjet}</div>
        </Heading1>
        <ProjectHeaderBadge project={project} />
      </div>
      <div className="font-medium mt-3">
        {project.communeProjet}, {project.departementProjet}, {project.regionProjet}
      </div>
      <div>{project.potentielIdentifier}</div>
      <div className="hidden print:block">
        Instruction selon le cahier des charges{' '}
        {project.cahierDesChargesActuel.type === 'initial'
          ? 'initial (en vigueur à la candidature)'
          : `${
              project.cahierDesChargesActuel.alternatif ? 'alternatif' : ''
            } modifié rétroactivement et publié le ${project.cahierDesChargesActuel.paruLe}`}
      </div>
    </div>

    <div className="px-3">
      <ProjectActions
        project={project}
        user={user}
        abandonEnCoursOuAccordé={abandonEnCoursOuAccordé}
        demandeRecours={demandeRecours}
        modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
        estAchevé={estAchevé}
        représentantLégalAffichage={représentantLégalAffichage}
        puissanceAffichage={puissanceAffichage}
        actionnaireAffichage={actionnaireAffichage}
        producteurAffichage={producteurAffichage}
        fournisseurAffichage={fournisseurAffichage}
        délaiAffichage={délaiAffichage}
        installateurAffichage={installateurAffichage}
        features={user.features}
        installationAvecDispositifDeStockageAffichage={
          installationAvecDispositifDeStockageAffichage
        }
        natureDeLExploitationAffichage={natureDeLExploitationAffichage}
      />
    </div>
  </div>
);
