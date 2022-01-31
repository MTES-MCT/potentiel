import { ProjectEventDTO } from '@modules/frise'

export type CRItemProps = {
  type: 'convention-de-raccordement'
  status: 'not-submitted'
  date: undefined
}

export const extractCRItemProps = (
  events: ProjectEventDTO[],
  project: {
    isLaureat: boolean
  }
): CRItemProps | null => {
  if (!events.length || !project.isLaureat) {
    return null
  }

  return {
    type: 'convention-de-raccordement',
    status: 'not-submitted',
    date: undefined,
  }
}
