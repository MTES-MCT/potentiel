import { is, ProjectEventDTO, ProjectStatus } from '@modules/frise'

export type ACItemProps = {
  type: 'attestation-de-conformite'
  date: number
}

export const extractACItemProps = (
  events: ProjectEventDTO[],
  project: { status: ProjectStatus }
): ACItemProps | null => {
  if (project.status !== 'Classé') {
    return null
  }

  const completionDueDateSetEvent = events.filter(is('ProjectCompletionDueDateSet')).pop()
  return completionDueDateSetEvent
    ? {
        type: 'attestation-de-conformite',
        date: completionDueDateSetEvent.date,
      }
    : null
}
