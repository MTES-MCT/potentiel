import { Project } from '../../../../entities';
import {
  is,
  ProjectCertificateDTO,
  ProjectEventDTO,
  ProjectStatus,
} from '../../../../modules/frise';
import { UserRole } from '../../../../modules/users';
import { or } from '../../../../core/utils';
import { Routes } from '@potentiel-applications/routes';

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
  // récupérer le projet
  const { certificateFileId, nomProjet, potentielIdentifier, variant } = latestCertificateEvent;
console.log("violette",potentielIdentifier)
    return Routes.Candidature.téléchargerAttestation(potentielIdentifier)
  
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
