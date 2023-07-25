import { Project } from '@entities';
import ROUTES from '@routes';
import {
  is,
  ProjectCertificateDTO,
  ProjectEventDTO,
  ProjectStatus,
} from '@modules/frise';
import { UserRole } from '@modules/users';
import { or } from '../../../../core/utils';

export type DesignationItemProps = {
  type: 'designation';
  date: number;
  role: UserRole;
  projectStatus: ProjectStatus;
  certificate:
    | {
        date: number;
        url: string;
        status: 'uploaded' | 'generated';
      }
    | {
        status: 'not-applicable';
      }
    | undefined;
};

export const isCertificateGeneratedDTO = or(
  is('ProjectCertificateGenerated'),
  is('ProjectCertificateRegenerated'),
  is('ProjectCertificateUpdated'),
);

export const extractDesignationItemProps = (
  events: ProjectEventDTO[],
  projectId: Project['id'],
  status: ProjectStatus,
): DesignationItemProps | null => {
  const projetDesignationEvents = events.filter(isProjectDesignation);
  const lastProjectDesignationEvent = projetDesignationEvents.pop();

  if (!lastProjectDesignationEvent) return null;
  const { variant: role, date } = lastProjectDesignationEvent;

  const certificateEvent =
    events.filter(isCertificateGeneratedDTO).pop() ?? events.filter(is('ProjectClaimed')).pop();

  if (certificateEvent) {
    return {
      type: 'designation',
      date,
      certificate: makeCertificateProps(certificateEvent, projectId),
      role: certificateEvent.variant,
      projectStatus: status,
    };
  }

  return {
    type: 'designation',
    date,
    certificate:
      'isLegacy' in lastProjectDesignationEvent && lastProjectDesignationEvent.isLegacy
        ? { status: 'not-applicable' }
        : undefined,
    role,
    projectStatus: status,
  };
};

const isProjectDesignation = or(is('ProjectNotificationDateSet'), is('ProjectNotified'));

const makeCertificateLink = (
  latestCertificateEvent: ProjectCertificateDTO,
  projectId: Project['id'],
) => {
  const { certificateFileId, nomProjet, potentielIdentifier, variant } = latestCertificateEvent;
  if (variant === 'admin' || variant === 'dgec-validateur') {
    return ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS({
      id: projectId,
      certificateFileId,
      email: latestCertificateEvent.email,
      potentielIdentifier,
    });
  }

  return ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
    id: projectId,
    certificateFileId,
    nomProjet,
    potentielIdentifier,
  });
};

const makeCertificateProps = (
  certificateEvent: ProjectCertificateDTO,
  projectId: Project['id'],
): DesignationItemProps['certificate'] => {
  return {
    date: certificateEvent.date,
    status: ['ProjectClaimed', 'ProjectCertificateUpdated'].includes(certificateEvent.type)
      ? 'uploaded'
      : 'generated',
    url: makeCertificateLink(certificateEvent, projectId),
  };
};
