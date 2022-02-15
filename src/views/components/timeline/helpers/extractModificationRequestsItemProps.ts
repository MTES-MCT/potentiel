import { is, ModificationRequestDTO, ProjectEventDTO } from '@modules/frise'
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
  }, {} as Record<string, ModificationRequestDTO[]>)

  const props: ModificationRequestItemProps[] = Object.entries(modificationRequests).map(
    ([, events]) => {
      const sortedEvents = events.sort((a, b) => a.date - b.date)
      const modificationRequestedEvent = events.filter(is('ModificationRequested'))[0]
      const lastEvent = sortedEvents[sortedEvents.length - 1]

      const { date, variant: role } = lastEvent
      const { authority, modificationType, delayInMonths } = modificationRequestedEvent
      const status = getStatus(lastEvent)
      let url: string | undefined = undefined
      if (
        or(is('ModificationRequestRejected'), is('ModificationRequestAccepted'))(lastEvent) &&
        lastEvent.file?.name
      ) {
        url = makeDocumentUrl(lastEvent.file.id, lastEvent.file.name)
      }

      return modificationType === 'delai'
        ? {
            type: 'demande-de-modification',
            date,
            authority,
            modificationType,
            status,
            role,
            url,
            delayInMonths,
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

  return props
}

const isModificationRequest = or(
  is('ModificationRequested'),
  is('ModificationRequestRejected'),
  is('ModificationRequestInstructionStarted'),
  is('ModificationRequestAccepted'),
  is('ModificationRequestCancelled')
)

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
