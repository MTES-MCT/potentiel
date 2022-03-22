import { is, ProjectEventDTO } from '@modules/frise/dtos'
import { LegacyModificationStatus } from 'src/modules/modificationRequest'

export type LegacyModificationsItemProps = {
  type: 'modification-historique'
  date: number
  status: LegacyModificationStatus
} & (
  | {
      modificationType: 'delai'
      status: Extract<LegacyModificationStatus, 'acceptée'>
      ancienneDateLimiteAchevement: number
      nouvelleDateLimiteAchevement: number
    }
  | {
      modificationType: 'delai'
      status: Extract<LegacyModificationStatus, 'rejetée' | 'accord-de-principe'>
    }
  | {
      modificationType: 'abandon'
    }
  | {
      modificationType: 'recours'
      motifElimination: string
    }
  | {
      modificationType: 'producteur'
      producteurPrecedent: string
    }
  | {
      modificationType: 'actionnaire'
      actionnairePrecedent: string
    }
  | {
      modificationType: 'autre'
      column: string
      value: string
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
          status: event.status,
          modificationType: 'abandon',
        })
        break
      case 'recours':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          status: event.status,
          modificationType: 'recours',
          motifElimination: event.motifElimination,
        })
        break
      case 'delai':
        if (event.status === 'acceptée') {
          propsArray.push({
            type: 'modification-historique',
            date: event.date,
            modificationType: 'delai',
            status: event.status,
            ancienneDateLimiteAchevement: event.ancienneDateLimiteAchevement,
            nouvelleDateLimiteAchevement: event.nouvelleDateLimiteAchevement,
          })
        } else {
          propsArray.push({
            type: 'modification-historique',
            date: event.date,
            modificationType: 'delai',
            status: event.status,
          })
        }
        break
      case 'actionnaire':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          modificationType: 'actionnaire',
          actionnairePrecedent: event.actionnairePrecedent,
          status: event.status,
        })
        break
      case 'producteur':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          modificationType: 'producteur',
          producteurPrecedent: event.producteurPrecedent,
          status: event.status,
        })
        break
      case 'autre':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          modificationType: 'autre',
          column: event.column,
          value: event.value,
          status: event.status,
        })
        break
    }
  }

  return propsArray
}
