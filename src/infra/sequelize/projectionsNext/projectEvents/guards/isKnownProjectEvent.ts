import { or } from '@core/utils'
import { ProjectEvent } from '@infra/sequelize'
import {
  CovidDelayGrantedEvent,
  ProjectCertificateEvents,
  ProjectClaimedEvent,
  ProjectDCREvents,
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
  DemandeAbandonEvent,
  CahierDesChargesEvent,
  DateMiseEnServiceEvent,
  DateFileAttenteEvent,
} from '../events'

export type KnownProjectEvents =
  | ProjectImportedEvent
  | ProjectClaimedEvent
  | ProjectNotifiedEvent
  | ProjectCompletionDueDateSetEvent
  | ProjectNotificationDateSetEvent
  | CovidDelayGrantedEvent
  | ProjectCertificateEvents
  | ProjectDCREvents
  | ProjectPTFEvents
  | ModificationRequestEvents
  | FileAttachedToProjectEvent
  | LegacyModificationFileAttachedEvent
  | DemandeSignaledEvents
  | DemandeDélaiEvent
  | DemandeAbandonEvent
  | CahierDesChargesEvent
  | DateMiseEnServiceEvent
  | DateFileAttenteEvent

type NarrowType<T, N> = T extends { type: N } ? T : never

export const is =
  <T extends KnownProjectEvents, K extends T['type']>(type: K) =>
  (event: ProjectEvent): event is NarrowType<T, K> =>
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
  is('ProjectDCRSubmitted'),
  is('ProjectDCRRemoved'),
  is('ProjectDCRDueDateSet'),
  is('ProjectPTFSubmitted'),
  is('ProjectPTFRemoved'),
  is('ModificationRequested'),
  is('ModificationRequestAccepted'),
  is('ModificationRequestRejected'),
  is('ModificationRequestCancelled'),
  is('ModificationRequestInstructionStarted'),
  is('ModificationReceived'),
  is('LegacyModificationImported'),
  is('FileAttachedToProject'),
  is('LegacyModificationFileAttached'),
  is('DemandeDelaiSignaled'),
  is('DemandeAbandonSignaled'),
  is('DemandeRecoursSignaled'),
  is('DemandeDélai'),
  is('DemandeAbandon'),
  is('CahierDesChargesChoisi'),
  is('DateMiseEnService'),
  is('DateFileAttente')
)
