import {
  is,
  ProjectCertificateDTO,
  ProjectEventDTO,
  ProjectStatus,
} from '../../../../modules/frise';
import { UserRole } from '../../../../modules/users';
import { or } from '../../../../core/utils';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';

// TODO: reprendre cette partie

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

export const extractDesignationItemProps = (
  events: ProjectEventDTO[],
  status: ProjectStatus,
  identifiantProjet: IdentifiantProjet.RawType,
): DesignationItemProps | null => {
  const projetDesignationEvents = events.filter(isProjectDesignation);
  const lastProjectDesignationEvent = projetDesignationEvents.pop();

  if (!lastProjectDesignationEvent) return null;
  const { variant: role, date } = lastProjectDesignationEvent;

  const certificateEvent = events.filter(is('ProjectClaimed')).pop();

  if (certificateEvent) {
    return {
      type: 'designation',
      date,
      certificate: makeCertificateProps(certificateEvent, identifiantProjet),
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

const makeCertificateLink = (identifiantProjet: IdentifiantProjet.RawType) => {
  return Routes.Candidature.téléchargerAttestation(identifiantProjet);
};

const makeCertificateProps = (
  certificateEvent: ProjectCertificateDTO,
  identifiantProjet: IdentifiantProjet.RawType,
): DesignationItemProps['certificate'] => {
  return {
    date: certificateEvent.date,
    status: ['ProjectClaimed', 'ProjectCertificateUpdated'].includes(certificateEvent.type)
      ? 'uploaded'
      : 'generated',
    url: makeCertificateLink(identifiantProjet),
  };
};
