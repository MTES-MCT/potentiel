import { is, ProjectEventDTO, ProjectStatus } from '@modules/frise'
import { or } from '@core/utils'
import { UserRole } from '@modules/users'
import { makeDocumentUrl } from './makeDocumentUrl'

export type GFItemProps = {
  type: 'garanties-financieres'
  role: UserRole
} & (
  | {
      status: 'due' | 'past-due'
      date: number
    }
  | {
      status: 'pending-validation' | 'validated' | 'uploaded'
      url: string | undefined
      date: number
      expirationDate: number | undefined
      uploadedByRole: 'porteur-projet' | 'dreal' | undefined
    }
  | {
      status: 'submitted-with-application'
      date: undefined
    }
)

export const extractGFItemProps = (
  events: ProjectEventDTO[],
  now: number,
  project: {
    status: ProjectStatus
    isSoumisAuxGF?: boolean
    isGarantiesFinancieresDeposeesALaCandidature?: boolean
  }
): GFItemProps | null => {
  if (!events.length || project.status === 'Eliminé' || !project.isSoumisAuxGF) {
    return null
  }

  const GFEvents = events.filter(isProjectGF)

  if (!GFEvents.length) {
    return project.isGarantiesFinancieresDeposeesALaCandidature && project.status !== 'Abandonné'
      ? {
          type: 'garanties-financieres',
          role: events.slice(-1)[0].variant,
          status: 'submitted-with-application',
          date: undefined,
        }
      : null
  }

  const latestProjectGF = GFEvents.slice(-1)[0]
  const latestDueDateSetEvent = events.filter(is('ProjectGFDueDateSet')).pop()
  const latestSubmittedEvent = events.filter(is('ProjectGFSubmitted')).pop()

  if (
    latestProjectGF.type === 'ProjectGFWithdrawn' &&
    project.isGarantiesFinancieresDeposeesALaCandidature &&
    project.status !== 'Abandonné'
  ) {
    return {
      type: 'garanties-financieres',
      role: events.slice(-1)[0].variant,
      status: 'submitted-with-application',
      date: undefined,
    }
  }

  const eventToHandle =
    latestProjectGF.type === 'ProjectGFRemoved' && latestDueDateSetEvent
      ? latestDueDateSetEvent
      : latestProjectGF.type === 'ProjectGFValidated' && latestSubmittedEvent
      ? latestSubmittedEvent
      : latestProjectGF.type === 'ProjectGFInvalidated' && latestSubmittedEvent
      ? latestSubmittedEvent
      : latestProjectGF

  const { date, variant: role, type } = eventToHandle

  const props = {
    type: 'garanties-financieres' as 'garanties-financieres',
    date,
    role,
  }

  if (type === 'ProjectGFUploaded') {
    return {
      ...props,
      url: eventToHandle.file && makeDocumentUrl(eventToHandle.file.id, eventToHandle.file.name),
      status: 'uploaded',
      expirationDate: eventToHandle.expirationDate,
      uploadedByRole: eventToHandle.uploadedByRole,
    }
  }

  if (type === 'ProjectGFSubmitted') {
    return {
      ...props,
      url: eventToHandle.file && makeDocumentUrl(eventToHandle.file.id, eventToHandle.file.name),
      status: latestProjectGF.type === 'ProjectGFValidated' ? 'validated' : 'pending-validation',
      expirationDate: eventToHandle.expirationDate,
      uploadedByRole: 'porteur-projet',
    }
  }

  return project.status !== 'Abandonné'
    ? {
        ...props,
        status: date < now ? 'past-due' : 'due',
      }
    : null
}

const isProjectGF = or(
  is('ProjectGFDueDateSet'),
  is('ProjectGFSubmitted'),
  is('ProjectGFRemoved'),
  is('ProjectGFValidated'),
  is('ProjectGFInvalidated'),
  is('ProjectGFUploaded'),
  is('ProjectGFWithdrawn')
)
