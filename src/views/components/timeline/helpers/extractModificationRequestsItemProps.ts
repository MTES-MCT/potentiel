import {
  is,
  ModificationRequestedDTO,
  ModificationRequestRejectedDTO,
  ProjectEventDTO,
} from '@modules/frise'
import { ModificationRequestStatusDTO } from '@modules/modificationRequest'
import { or } from '@core/utils'

export type ModificationRequestItemProps = {
  type: 'demande-de-modification'
  date: number
  status: ModificationRequestStatusDTO
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
  const modificationRequestedEvents = events.filter(isModificationRequest)
  if (modificationRequestedEvents.length === 0) {
    return []
  }

  const modificationRequests = modificationRequestedEvents.reduce((modificationRequests, event) => {
    if (modificationRequests[event.modificationRequestId]) {
      modificationRequests[event.modificationRequestId].push(event)
    } else {
      modificationRequests[event.modificationRequestId] = [event]
    }
    return modificationRequests
  }, {} as Record<string, (ModificationRequestedDTO | ModificationRequestRejectedDTO)[]>)

  const props: ModificationRequestItemProps[] = Object.entries(modificationRequests).map(
    ([, events]) => {
      const sortedEvents = events.sort((a, b) => a.date - b.date)
      const modificationRequestedEvent = events.filter(is('ModificationRequested'))[0]
      const lastEvent = sortedEvents[sortedEvents.length - 1]

      const { date } = lastEvent
      const { authority, modificationType, delayInMonths } = modificationRequestedEvent

      return modificationType === 'delai'
        ? {
            type: 'demande-de-modification',
            date,
            authority,
            modificationType,
            status: lastEvent.type === 'ModificationRequested' ? 'envoyée' : 'rejetée',
            delayInMonths,
          }
        : {
            type: 'demande-de-modification',
            date,
            authority,
            modificationType,
            status: lastEvent.type === 'ModificationRequested' ? 'envoyée' : 'rejetée',
          }
    }
  )

  return props
}

const isModificationRequest = or(is('ModificationRequested'), is('ModificationRequestRejected'))
