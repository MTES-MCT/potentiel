import { is, ProjectEventDTO, ProjectStatus } from '../../../../modules/frise';
import { UserRole } from '../../../../modules/users';
import { or } from '../../../../core/utils';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type DesignationItemProps = {
  type: 'designation';
  date: number;
  role: UserRole;
  projectStatus: ProjectStatus;
  isLegacy: boolean | undefined;
  identifiantProjet: string;
};

export const extractDesignationItemProps = (
  events: ProjectEventDTO[],
  status: ProjectStatus,
  identifiantProjet: IdentifiantProjet.RawType,
): DesignationItemProps | null => {
  const projetDesignationEvents = events.filter(isProjectDesignation);
  const isLegacy = events.find(is('ProjectNotified'))?.isLegacy;
  const lastProjectDesignationEvent = projetDesignationEvents.pop();

  if (!lastProjectDesignationEvent) return null;
  const { variant: role, date } = lastProjectDesignationEvent;

  return {
    type: 'designation',
    date,
    isLegacy: isLegacy,
    role,
    projectStatus: status,
    identifiantProjet,
  };
};

const isProjectDesignation = or(is('ProjectNotificationDateSet'), is('ProjectNotified'));
