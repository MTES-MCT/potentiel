import { or } from '@core/utils';
import { ProjectEvent } from '@infra/sequelize';
import {
  CovidDelayGrantedEvent,
  ProjectCertificateEvents,
  ProjectClaimedEvent,
  ProjectImportedEvent,
  ProjectNotificationDateSetEvent,
  ProjectNotifiedEvent,
  ProjectCompletionDueDateSetEvent,
  ModificationRequestEvents,
  FileAttachedToProjectEvent,
  LegacyModificationFileAttachedEvent,
  DemandeDélaiEvent,
  DemandeAbandonEvent,
  CahierDesChargesEvent,
  DateMiseEnServiceEvent,
  DateFileAttenteEvent,
  DemandeDelaiSignaledEvent,
  DemandeAbandonSignaledEvent,
  DemandeRecoursSignaledEvent,
  DemandeAnnulationAbandonEvent,
} from '../events';

export type KnownProjectEvents =
  | ProjectImportedEvent
  | ProjectClaimedEvent
  | ProjectNotifiedEvent
  | ProjectCompletionDueDateSetEvent
  | ProjectNotificationDateSetEvent
  | CovidDelayGrantedEvent
  | ProjectCertificateEvents
  | ModificationRequestEvents
  | FileAttachedToProjectEvent
  | LegacyModificationFileAttachedEvent
  | DemandeDélaiEvent
  | DemandeAbandonEvent
  | CahierDesChargesEvent
  | DateMiseEnServiceEvent
  | DateFileAttenteEvent
  | DemandeDelaiSignaledEvent
  | DemandeRecoursSignaledEvent
  | DemandeAbandonSignaledEvent
  | DemandeAnnulationAbandonEvent;

type NarrowType<T, N> = T extends { type: N } ? T : never;

/**
 * @deprecated cette fonction n'a rien à faire dans une couche d'accés au données
 */
export const is =
  <T extends KnownProjectEvents, K extends T['type']>(type: K) =>
  (event: ProjectEvent): event is NarrowType<T, K> =>
    event.type === type;

/**
 * @deprecated cette fonction n'a rien à faire dans une couche d'accés au données
 */
export const isKnownProjectEvent = or(
  is('ProjectImported'),
  is('ProjectClaimed'),
  is('ProjectNotified'),
  is('ProjectNotificationDateSet'),
  is('ProjectCompletionDueDateSet'),
  is('CovidDelayGranted'),
  is('ProjectCertificateGenerated'),
  is('ProjectCertificateRegenerated'),
  is('ProjectCertificateUpdated'),
  is('ModificationRequested'),
  is('ModificationRequestAccepted'),
  is('ModificationRequestRejected'),
  is('ModificationRequestCancelled'),
  is('ModificationRequestInstructionStarted'),
  is('ModificationReceived'),
  is('LegacyModificationImported'),
  is('FileAttachedToProject'),
  is('LegacyModificationFileAttached'),
  is('DemandeAbandonSignaled'),
  is('DemandeRecoursSignaled'),
  is('DemandeDélai'),
  is('DemandeAbandon'),
  is('CahierDesChargesChoisi'),
  is('DateMiseEnService'),
  is('DateFileAttente'),
  is('DemandeDelaiSignaled'),
  is('DemandeAbandonSignaled'),
  is('DemandeRecoursSignaled'),
  is('DemandeAnnulationAbandon'),
);
