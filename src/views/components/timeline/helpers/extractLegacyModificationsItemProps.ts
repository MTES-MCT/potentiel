import { is, ProjectEventDTO } from '@modules/frise/dtos'

export type LegacyModificationsItemProps = {
  type: 'modification-historique'
  date: number
} & (
  | {
      modificationType: 'delai'
      ancienneDateLimiteAchevement: number
      nouvelleDateLimiteAchevement: number
      status: 'acceptée'
    }
  | {
      modificationType: 'abandon'
      status: 'acceptée' | 'rejetée'
    }
  | {
      modificationType: 'recours'
      status: 'acceptée' | 'rejetée'
    }
  | {
      modificationType: 'producteur'
      producteurPrecedent: string
      status: 'acceptée'
    }
  | {
      modificationType: 'actionnaire'
      actionnairePrecedent: string
      status: 'acceptée'
    }
  | {
      modificationType: 'autre'
      column: string
      value: string
      status: 'acceptée'
    }
)

export const extractLegacyModificationsItemProps = (events: ProjectEventDTO[]) => {
  if (!events.length) {
    return []
  }
  const legacyModificationEvents = events.filter(is('LegacyModificationImported'))

  if (!legacyModificationEvents.length) {
    return []
  }

  let propsArray: LegacyModificationsItemProps[] = []

  for (const event of legacyModificationEvents) {
    switch (event.modificationType) {
      case 'abandon':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          status: event.accepted ? 'acceptée' : 'rejetée',
          modificationType: 'abandon',
        })
        break
      case 'recours':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          status: event.accepted ? 'acceptée' : 'rejetée',
          modificationType: 'recours',
        })
        break
      case 'delai':
        if (event.accepted) {
          propsArray.push({
            type: 'modification-historique',
            date: event.date,
            modificationType: 'delai',
            ancienneDateLimiteAchevement: event.ancienneDateLimiteAchevement,
            nouvelleDateLimiteAchevement: event.nouvelleDateLimiteAchevement,
            status: 'acceptée',
          })
        }
        break
      case 'actionnaire':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          modificationType: 'actionnaire',
          actionnairePrecedent: event.actionnairePrecedent,
          status: 'acceptée',
        })
        break
      case 'producteur':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          modificationType: 'producteur',
          producteurPrecedent: event.producteurPrecedent,
          status: 'acceptée',
        })
        break
      case 'autre':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          modificationType: 'autre',
          column: event.column,
          value: event.value,
          status: 'acceptée',
        })
        break
    }
  }

  return propsArray
}
