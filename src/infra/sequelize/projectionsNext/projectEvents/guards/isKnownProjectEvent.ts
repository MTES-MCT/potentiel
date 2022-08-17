import { or } from '@core/utils'
import {
  CovidDelayGrantedEvent,
  ProjectCertificateEvents,
  ProjectClaimedEvent,
  ProjectDCREvents,
  ProjectGFEvents,
  ProjectImportedEvent,
  ProjectNotificationDateSetEvent,
  ProjectNotifiedEvent,
  ProjectCompletionDueDateSetEvent,
  ProjectPTFEvents,
  ModificationRequestEvents,
  FileAttachedToProjectEvent,
  LegacyModificationFileAttachedEvent,
  DemandeSignaledEvents,
  DemandeDélaiEvent,
} from '../events'

export type KnownProjectEvents =
  | ProjectImportedEvent
  | ProjectClaimedEvent
  | ProjectNotifiedEvent
  | ProjectCompletionDueDateSetEvent
  | ProjectNotificationDateSetEvent
  | CovidDelayGrantedEvent
  | ProjectCertificateEvents
  | ProjectGFEvents
  | ProjectDCREvents
  | ProjectPTFEvents
  | ModificationRequestEvents
  | FileAttachedToProjectEvent
  | LegacyModificationFileAttachedEvent
  | DemandeSignaledEvents
  | DemandeDélaiEvent

type NarrowType<T, N> = T extends { type: N } ? T : never

export const is =
  <T extends KnownProjectEvents, K extends T['type']>(type: K) =>
  (event: KnownProjectEvents): event is NarrowType<T, K> =>
    event.type === type

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
  is('ProjectGFSubmitted'),
  is('ProjectGFUploaded'),
  is('ProjectGFInvalidated'),
  is('ProjectGFRemoved'),
  is('ProjectGFWithdrawn'),
  is('ProjectDCRSubmitted'),
  is('ProjectDCRRemoved'),
  is('ProjectPTFSubmitted'),
  is('ProjectPTFRemoved'),
  is('ModificationRequested'),
  is('ModificationRequestAccepted'),
  is('ModificationRequestRejected'),
  is('ConfirmationRequested'),
  is('FileAttachedToProject'),
  is('LegacyModificationFileAttached'),
  is('DemandeDelaiSignaled'),
  is('DemandeDélai')
)
