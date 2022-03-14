import { ProjectEventDTO, ProjectEventListDTO } from '@modules/frise'

export type CAItemProps = {
  type: 'contrat-achat'
  status: 'not-submitted'
  date: undefined
}

export const extractCAItemProps = (
  events: ProjectEventDTO[],
  project: {
    status: ProjectEventListDTO['project']['status']
  }
): CAItemProps | null => {
  if (!events.length || project.status !== 'Classé') {
    return null
  }

  return {
    type: 'contrat-achat',
    status: 'not-submitted',
    date: undefined,
  }
}
