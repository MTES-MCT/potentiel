import { is, ModificationRequestDTO, ProjectEventDTO } from '@modules/frise'
import { or } from '@core/utils'
import { makeDocumentUrl } from '.'
import { UserRole } from '@modules/users'

export type ModificationRequestItemProps = {
  type: 'demande-de-modification'
  date: number
  status:
    | 'envoyé'
    | 'en instruction'
    | 'accepté'
    | 'rejeté'
    | 'annulé'
    | 'en attente de confirmation'
    | 'confirmé'
  authority: 'dreal' | 'dgec'
  role: UserRole
  url?: string | undefined
} & (
  | {
      modificationType: 'delai'
      delayInMonths: number
    }
  | {
      modificationType: 'puissance'
      puissance: number
      unitePuissance: string
    }
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

  const propsArray: ModificationRequestItemProps[] = Object.entries(modificationRequestGroups)
    .filter(([, events]) => events.find(is('ModificationRequested')))
    .map(([, events]): ModificationRequestItemProps => {
      const latestEvent = getLatestEvent(events)
      const requestEvent = getRequestEvent(events)

      const { date, variant: role } = latestEvent
      const { authority, modificationType } = requestEvent
      const status = getStatus(latestEvent)
      const url = getUrl(latestEvent)

      switch (modificationType) {
        case 'delai':
          return {
            type: 'demande-de-modification',
            date,
            authority,
            modificationType,
            status,
            role,
            url,
            delayInMonths: requestEvent.delayInMonths,
          }

        case 'puissance':
          return {
            type: 'demande-de-modification',
            date,
            authority,
            modificationType,
            status,
            role,
            url,
            puissance: requestEvent.puissance,
            unitePuissance: requestEvent.unitePuissance || '??',
          }

        default:
          return {
            type: 'demande-de-modification',
            date,
            authority,
            modificationType,
            status,
            role,
            url,
          }
      }
    })

  return propsArray
}

const isModificationRequestEvent = or(
  is('ModificationRequested'),
  is('ModificationRequestRejected'),
  is('ModificationRequestInstructionStarted'),
  is('ModificationRequestAccepted'),
  is('ModificationRequestCancelled'),
  is('ConfirmationRequested'),
  is('ModificationRequestConfirmed')
)

const getEventsGroupedByModificationRequestId = (
  modificationRequestedEvents: ModificationRequestDTO[]
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
    or(
      is('ModificationRequestRejected'),
      is('ModificationRequestAccepted'),
      is('ConfirmationRequested')
    )(latestEvent) &&
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
      return 'envoyé'
    case 'ModificationRequestInstructionStarted':
      return 'en instruction'
    case 'ModificationRequestAccepted':
      return 'accepté'
    case 'ModificationRequestRejected':
      return 'rejeté'
    case 'ModificationRequestCancelled':
      return 'annulé'
    case 'ConfirmationRequested':
      return 'en attente de confirmation'
    case 'ModificationRequestConfirmed':
      return 'confirmé'
  }
}
