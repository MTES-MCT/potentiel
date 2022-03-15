import { ProjectEventDTO, ProjectStatus } from '@modules/frise'

export type CRItemProps = {
  type: 'convention-de-raccordement'
  status: 'not-submitted'
  date: undefined
}

export const extractCRItemProps = (
  events: ProjectEventDTO[],
  project: {
    status: ProjectStatus
  }
): CRItemProps | null => {
  if (!events.length || project.status !== 'Classé') {
    return null
  }

  return {
    type: 'convention-de-raccordement',
    status: 'not-submitted',
    date: undefined,
  }
}
