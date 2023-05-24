import React from 'react';
import { User } from '@entities';
import { ProjectDataForProjectPage } from '@modules/project/queries';
import { Badge, Heading1 } from '@components';
import { ProjectActions } from './ProjectActions';

type ProjectHeaderProps = {
  project: ProjectDataForProjectPage;
  user: User;
};

export const ProjectHeader = ({ project, user }: ProjectHeaderProps) => (
  <div className="w-full pt-3 md:pt-0 lg:flex justify-between gap-2">
    <div className="pl-3 mb-3">
      <div
        className="flex justify-start items-center
      "
      >
        <Heading1 className="mb-0 pb-0">{project.nomProjet}</Heading1>
        {!project.notifiedOn ? (
          <Badge type="info" className="ml-2 self-center">
            Non-notifié
          </Badge>
        ) : project.isAbandoned ? (
          <Badge type="warning" className="ml-2 self-center">
            Abandonné
          </Badge>
        ) : project.isClasse ? (
          <Badge type="success" className="ml-2 self-center">
            Classé
          </Badge>
        ) : (
          <Badge type="error" className="ml-2 self-center">
            Éliminé
          </Badge>
        )}
      </div>
      <p className="text-sm font-medium text-gray-500 p-0 mt-3 mb-0">
        {project.communeProjet}, {project.departementProjet}, {project.regionProjet}
      </p>
      <div className="text-sm">{project.potentielIdentifier}</div>
    </div>

    <div className="px-3">
      <ProjectActions {...{ project, user }} />
    </div>
  </div>
);
