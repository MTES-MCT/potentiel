import {
  is,
  ModificationRequestAcceptedDTO,
  ModificationRequestCancelledDTO,
  ModificationRequestDTO,
  ModificationRequestedDTO,
  ModificationRequestInstructionStartedDTO,
  ModificationRequestRejectedDTO,
  ProjectEventDTO,
} from '@modules/frise'
import { or } from '@core/utils'
import { makeDocumentUrl } from '.'
import { UserRole } from '@modules/users'

export type ModificationRequestItemProps = {
  type: 'demande-de-modification'
  date: number
  status: 'envoyée' | 'en instruction' | 'acceptée' | 'rejetée' | 'annulée'
  authority: 'dreal' | 'dgec'
  role: UserRole
  url?: string | undefined
} & (
  | { modificationType: 'delai'; delayInMonths: number }
  | {
      modificationType: 'recours' | 'abandon'
    }
)

export const extractModificationRequestsItemProps = (
  events: ProjectEventDTO[]
): ModificationRequestItemProps[] => {
  const modificationRequestEvents = events.filter(isModificationRequestEvent)
  if (modificationRequestEvents.length === 0) {
    return []
  }

  const modificationRequestGroups =
    getEventsGroupedByModificationRequestId(modificationRequestEvents)

  const propsArray: ModificationRequestItemProps[] = Object.entries(modificationRequestGroups).map(
    ([, events]) => {
      const latestEvent = getLatestEvent(events)
      const requestEvent = getRequestEvent(events)

      const { date, variant: role } = latestEvent
      const { authority, modificationType } = requestEvent
      const status = getStatus(latestEvent)
      const url = getUrl(latestEvent)

      return modificationType === 'delai'
        ? {
            type: 'demande-de-modification',
            date,
            authority,
            modificationType,
            status,
            role,
            url,
            delayInMonths: requestEvent.delayInMonths,
          }
        : {
            type: 'demande-de-modification',
            date,
            authority,
            modificationType,
            status,
            role,
            url,
          }
    }
  )
  return propsArray
}

const isModificationRequestEvent = or(
  is('ModificationRequested'),
  is('ModificationRequestRejected'),
  is('ModificationRequestInstructionStarted'),
  is('ModificationRequestAccepted'),
  is('ModificationRequestCancelled')
)

const getEventsGroupedByModificationRequestId = (
  modificationRequestedEvents: (
    | ModificationRequestedDTO
    | ModificationRequestAcceptedDTO
    | ModificationRequestCancelledDTO
    | ModificationRequestRejectedDTO
    | ModificationRequestInstructionStartedDTO
  )[]
) => {
  return modificationRequestedEvents.reduce((modificationRequests, event) => {
    if (modificationRequests[event.modificationRequestId]) {
      modificationRequests[event.modificationRequestId].push(event)
    } else {
      modificationRequests[event.modificationRequestId] = [event]
    }
    return modificationRequests
  }, {} as Record<string, ModificationRequestDTO[]>)
}

const getLatestEvent = (events: ModificationRequestDTO[]) => {
  const sortedEvents = events.sort((a, b) => a.date - b.date)
  return sortedEvents[sortedEvents.length - 1]
}

const getRequestEvent = (events: ModificationRequestDTO[]) => {
  return events.filter(is('ModificationRequested'))[0]
}

const getUrl = (latestEvent: ModificationRequestDTO) => {
  if (
    or(is('ModificationRequestRejected'), is('ModificationRequestAccepted'))(latestEvent) &&
    latestEvent.file?.name
  ) {
    return makeDocumentUrl(latestEvent.file.id, latestEvent.file.name)
  } else {
    return
  }
}

function getStatus(event: ModificationRequestDTO) {
  switch (event.type) {
    case 'ModificationRequested':
      return 'envoyée'
    case 'ModificationRequestInstructionStarted':
      return 'en instruction'
    case 'ModificationRequestAccepted':
      return 'acceptée'
    case 'ModificationRequestRejected':
      return 'rejetée'
    case 'ModificationRequestCancelled':
      return 'annulée'
  }
}
