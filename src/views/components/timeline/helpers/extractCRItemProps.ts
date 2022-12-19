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

  const utilisateur = events.filter((event) => event.type === 'ProjectNotified')
  if (
    utilisateur.length !== 0 &&
    !['porteur-projet', 'admin', 'dgec-validateur', 'dreal', 'acheteur-obligé'].includes(
      utilisateur[0].variant
    )
  ) {
    return null
  }

  return {
    type: 'convention-de-raccordement',
    status: 'not-submitted',
    date: undefined,
  }
}
