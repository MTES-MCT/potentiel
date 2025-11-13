import React from 'react';
import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { ProjectDataForProjectPage } from '../../../../modules/project/queries';
import { Heading1 } from '../../../components';
import { ProjectActions } from './ProjectActions';
import { ProjectHeaderBadge } from './ProjectHeaderBadge';
import { Lauréat } from '@potentiel-domain/projet';
import { GetNomProjetForProjectPage } from '../../../../controllers/project/getProjectPage/_utils/getNomProjet';

type Affichage = {
  label?: string;
  labelActions?: string;
  url: string;
};

export type ProjectHeaderProps = {
  project: ProjectDataForProjectPage;
  user: UtilisateurReadModel;
  abandonEnCoursOuAccordé: boolean;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  modificationsNonPermisesParLeCDCActuel: boolean;
  estAchevé: boolean;
  statutLauréat: Lauréat.StatutLauréat.RawType;
  features: Array<string>;

  représentantLégalAffichage?: Affichage;
  puissanceAffichage?: Affichage;
  producteurAffichage?: Affichage;
  actionnaireAffichage?: Affichage;
  fournisseurAffichage?: Affichage;
  installateurAffichage?: Affichage;
  typologieInstallationAffichage?: Affichage;
  dispositifDeStockageAffichage?: Affichage;
  natureDeLExploitationAffichage?: Affichage;
  délaiAffichage?: Affichage;
  siteDeProductionAffichage?: Affichage;
  doitAfficherAttestationDésignation: boolean;
  nomProjet: GetNomProjetForProjectPage;
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
  typologieInstallationAffichage,
  siteDeProductionAffichage,
  délaiAffichage,
  dispositifDeStockageAffichage,
  natureDeLExploitationAffichage,
  nomProjet,
  statutLauréat,
  doitAfficherAttestationDésignation,
}: ProjectHeaderProps) => (
  <div className="w-full pt-3 md:pt-0 print:pt-0 lg:flex justify-between gap-2">
    <div className="pl-3 print:pl-0 mb-3 text-sm">
      <div className="flex md:flex-row flex-col justify-start md:items-end gap-4">
        <Heading1 className="mb-0 pb-0">
          <div className="inline-block leading-10">{nomProjet.nom}</div>
        </Heading1>
        <ProjectHeaderBadge statutLauréat={statutLauréat} />
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
        typologieInstallationAffichage={typologieInstallationAffichage}
        features={user.features}
        dispositifDeStockageAffichage={dispositifDeStockageAffichage}
        natureDeLExploitationAffichage={natureDeLExploitationAffichage}
        siteDeProductionAffichage={siteDeProductionAffichage}
        nomProjet={nomProjet}
        doitAfficherAttestationDésignation={doitAfficherAttestationDésignation}
      />
    </div>
  </div>
);
