import { ProjectEventDTO, ProjectEventListDTO } from '@modules/frise'

export type MeSItemProps = {
  type: 'mise-en-service'
  status: 'not-submitted'
  date: undefined
}

export const extractMeSItemProps = (
  events: ProjectEventDTO[],
  project: {
    status: ProjectEventListDTO['project']['status']
  }
): MeSItemProps | null => {
  if (!events.length || project.status !== 'Classé') {
    return null
  }

  return {
    type: 'mise-en-service',
    status: 'not-submitted',
    date: undefined,
  }
}
