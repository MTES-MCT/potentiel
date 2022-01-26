import { ProjectEventDTO } from '@modules/frise'

export type CAItemProps = {
  type: 'contrat-achat'
  status: 'not-submitted'
  date: undefined
}

export const extractCAItemProps = (
  events: ProjectEventDTO[],
  project: {
    isLaureat: boolean
  }
): CAItemProps | null => {
  if (!events.length || !project.isLaureat) {
    return null
  }

  return {
    type: 'contrat-achat',
    status: 'not-submitted',
    date: undefined,
  }
}
