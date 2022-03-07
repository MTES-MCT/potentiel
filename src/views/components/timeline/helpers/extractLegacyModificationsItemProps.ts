import { is, ProjectEventDTO } from '@modules/frise/dtos'

export type LegacyModificationsItemProps = {
  type: 'modification-historique'
  date: number
} & (
  | {
      modificationType: 'delai'
      ancienneDateLimiteAchevement: number
      nouvelleDateLimiteAchevement: number
      status: 'accepté'
    }
  | {
      modificationType: 'abandon'
      status: 'accepté'
    }
  | {
      modificationType: 'recours'
      status: 'accepté' | 'rejeté'
    }
  | {
      modificationType: 'producteur'
      producteurPrecedent: string
      status: 'accepté'
    }
  | {
      modificationType: 'actionnaire'
      actionnairePrecedent: string
      status: 'accepté'
    }
  | {
      modificationType: 'autre'
      column: string
      value: string
      status: 'accepté'
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
          status: 'accepté',
          modificationType: 'abandon',
        })
        break
      case 'recours':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          status: event.accepted ? 'accepté' : 'rejeté',
          modificationType: 'recours',
        })
        break
      case 'delai':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          modificationType: 'delai',
          ancienneDateLimiteAchevement: event.ancienneDateLimiteAchevement,
          nouvelleDateLimiteAchevement: event.nouvelleDateLimiteAchevement,
          status: 'accepté',
        })
        break
      case 'actionnaire':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          modificationType: 'actionnaire',
          actionnairePrecedent: event.actionnairePrecedent,
          status: 'accepté',
        })
        break
      case 'producteur':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          modificationType: 'producteur',
          producteurPrecedent: event.producteurPrecedent,
          status: 'accepté',
        })
        break
      case 'autre':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          modificationType: 'autre',
          column: event.column,
          value: event.value,
          status: 'accepté',
        })
        break
    }
  }

  return propsArray
}
