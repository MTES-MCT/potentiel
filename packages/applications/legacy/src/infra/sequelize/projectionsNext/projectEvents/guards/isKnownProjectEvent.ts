import { or } from '../../../../../core/utils';
import { ProjectEvent } from '../../..';
import {
  CovidDelayGrantedEvent,
  ProjectClaimedEvent,
  ProjectImportedEvent,
  ProjectNotificationDateSetEvent,
  ProjectNotifiedEvent,
  ProjectCompletionDueDateSetEvent,
  ModificationRequestEvents,
  FileAttachedToProjectEvent,
  LegacyModificationFileAttachedEvent,
  DemandeDélaiEvent,
  CahierDesChargesEvent,
  DateMiseEnServiceEvent,
  DateFileAttenteEvent,
  DemandeDelaiSignaledEvent,
  DemandeRecoursSignaledEvent,
} from '../events';

export type KnownProjectEvents =
  | ProjectImportedEvent
  | ProjectClaimedEvent
  | ProjectNotifiedEvent
  | ProjectCompletionDueDateSetEvent
  | ProjectNotificationDateSetEvent
  | CovidDelayGrantedEvent
  | ModificationRequestEvents
  | FileAttachedToProjectEvent
  | LegacyModificationFileAttachedEvent
  | DemandeDélaiEvent
  | CahierDesChargesEvent
  | DateMiseEnServiceEvent
  | DateFileAttenteEvent
  | DemandeDelaiSignaledEvent
  | DemandeRecoursSignaledEvent;

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
  is('ModificationRequested'),
  is('ModificationRequestAccepted'),
  is('ModificationRequestRejected'),
  is('ModificationRequestCancelled'),
  is('ModificationRequestInstructionStarted'),
  is('ModificationReceived'),
  is('LegacyModificationImported'),
  is('FileAttachedToProject'),
  is('LegacyModificationFileAttached'),
  is('DemandeRecoursSignaled'),
  is('DemandeDélai'),
  is('CahierDesChargesChoisi'),
  is('DateMiseEnService'),
  is('DateFileAttente'),
  is('DemandeDelaiSignaled'),
  is('DemandeRecoursSignaled'),
);
