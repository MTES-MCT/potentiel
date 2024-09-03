import React from 'react';
import { ProjectDataForProjectPage } from '../../../../modules/project/queries';
import { Badge } from '../../../components';

type ProjectHeaderBadgeProps = {
  project: ProjectDataForProjectPage;
};

export const ProjectHeaderBadge = ({ project }: ProjectHeaderBadgeProps) => {
  return !project.notifiedOn ? (
    <Badge type="info">Non-notifié</Badge>
  ) : project.isAbandoned ? (
    <Badge type="warning">Abandonné</Badge>
  ) : project.isClasse ? (
    <Badge type="success">Classé</Badge>
  ) : (
    <Badge type="error">Éliminé</Badge>
  );
};
