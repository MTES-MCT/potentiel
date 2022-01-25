import { is, ProjectEventDTO } from '@modules/frise'

export type ACItemProps = {
  type: 'attestation-de-conformite'
  date: number
}

export const extractACItemProps = (events: ProjectEventDTO[]): ACItemProps | null => {
  const completionDueDateSetEvent = events.filter(is('ProjectCompletionDueDateSet')).pop()
  return completionDueDateSetEvent
    ? {
        type: 'attestation-de-conformite',
        date: completionDueDateSetEvent.date,
      }
    : null
}
