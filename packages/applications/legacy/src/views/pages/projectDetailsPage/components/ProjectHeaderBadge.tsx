import React from 'react';
import { ProjectDataForProjectPage } from '../../../../modules/project/queries';
import { Badge } from '../../../components';

type ProjectHeaderBadgeProps = {
  project: ProjectDataForProjectPage;
};

export const ProjectHeaderBadge = ({ project }: ProjectHeaderBadgeProps) => {
  const isEliminé = !project.isAbandoned && !project.isClasse;

  return (
    <div className="flex flex-row gap-2">
      {!project.notifiedOn && <Badge type="info">Non-notifié</Badge>}
      {project.isAbandoned && <Badge type="warning">Abandonné</Badge>}
      {project.isClasse && <Badge type="success">Classé</Badge>}
      {isEliminé && <Badge type="error">Éliminé</Badge>}
    </div>
  );
};
