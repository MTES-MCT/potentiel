import { ProjectEventDTO } from '@modules/frise'

export type MeSItemProps = {
  type: 'mise-en-service'
  status: 'not-submitted'
  date: undefined
}

export const extractMeSItemProps = (
  events: ProjectEventDTO[],
  project: {
    isLaureat: boolean
  }
): MeSItemProps | null => {
  if (!events.length || !project.isLaureat) {
    return null
  }

  return {
    type: 'mise-en-service',
    status: 'not-submitted',
    date: undefined,
  }
}
