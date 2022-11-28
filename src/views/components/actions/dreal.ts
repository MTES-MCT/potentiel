import ROUTES from '@routes'

const drealActions = (project: {
  id: string
  gf: { id: string; status: 'à traiter' | 'validé' }
  isAbandoned: boolean
}) => {
  const actions: any = []
  const { gf } = project

  if (project.isAbandoned) return []

  if (!gf) return actions

  if (!gf.status || gf.status === 'à traiter') {
    actions.push({
      title: 'Marquer la garantie financière comme validée',
      link: ROUTES.VALIDE_GF({
        projetId: project.id,
      }),
    })
  } else if (gf.status === 'validé') {
    actions.push({
      title: 'Marquer la garantie financière comme à traiter',
      link: ROUTES.INVALIDE_GF({
        projetId: project.id,
      }),
    })
  }
  return actions
}

export { drealActions }
