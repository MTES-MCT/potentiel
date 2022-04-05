import { is, ProjectEventDTO } from '@modules/frise/dtos'
import { LegacyModificationStatus } from 'src/modules/modificationRequest'
import { or } from '../../../../core/utils'

export type LegacyModificationsItemProps = {
  type: 'modification-historique'
  date: number
  status: LegacyModificationStatus
  courrier?: { id: string; name: string }
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

  const legacyFiles = events.filter(is('LegacyModificationFileAttached'))
  const getCourrier = (filename: string | undefined): { id: string; name: string } | undefined => {
    if (!filename) return

    const legacyFile = legacyFiles.find((fileEvent) => fileEvent.file.name === filename)
    return legacyFile && legacyFile.file
  }

  for (const event of legacyModificationEvents) {
    switch (event.modificationType) {
      case 'abandon':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          status: event.status,
          modificationType: 'abandon',
          courrier: getCourrier(event.filename),
        })
        break
      case 'recours':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          status: event.status,
          modificationType: 'recours',
          motifElimination: event.motifElimination,
          courrier: getCourrier(event.filename),
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
            courrier: getCourrier(event.filename),
          })
        } else {
          propsArray.push({
            type: 'modification-historique',
            date: event.date,
            modificationType: 'delai',
            status: event.status,
            courrier: getCourrier(event.filename),
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
          courrier: getCourrier(event.filename),
        })
        break
      case 'producteur':
        propsArray.push({
          type: 'modification-historique',
          date: event.date,
          modificationType: 'producteur',
          producteurPrecedent: event.producteurPrecedent,
          status: event.status,
          courrier: getCourrier(event.filename),
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
          courrier: getCourrier(event.filename),
        })
        break
    }
  }

  return propsArray
}
