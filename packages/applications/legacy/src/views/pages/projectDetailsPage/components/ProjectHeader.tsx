import React from 'react';
import { User } from '../../../../entities';
import { ProjectDataForProjectPage } from '../../../../modules/project/queries';
import { Heading1 } from '../../../components';
import { ProjectActions } from './ProjectActions';
import { ProjectHeaderBadge } from './ProjectHeaderBadge';

type ProjectHeaderProps = {
  project: ProjectDataForProjectPage;
  user: User;
  abandonEnCours: boolean;
  demandeRecours: ProjectDataForProjectPage['demandeRecours'];
  modificationsNonPermisesParLeCDCActuel: boolean;
  hasAttestationConformité: boolean;
};

export const ProjectHeader = ({
  project,
  user,
  abandonEnCours,
  demandeRecours,
  modificationsNonPermisesParLeCDCActuel,
  hasAttestationConformité,
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
        abandonEnCours={abandonEnCours}
        demandeRecours={demandeRecours}
        modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
        hasAttestationConformité={hasAttestationConformité}
      />
    </div>
  </div>
);
