import { is, ProjectEventDTO } from '@modules/frise'
import { Fournisseur } from '@modules/project'

export type ModificationReceivedItemProps = {
  type: 'modification-information'
  date: number
} & (
  | { modificationType: 'actionnaire'; actionnaire: string }
  | { modificationType: 'producteur'; producteur: string }
  | { modificationType: 'fournisseurs'; fournisseurs: Fournisseur[] }
)

export const extractModificationReceivedItemProps = (
  events: ProjectEventDTO[]
): ModificationReceivedItemProps[] => {
  if (!events.length) {
    return []
  }
  const modificationReceivedEvents = events.filter(is('ModificationReceived'))

  if (!modificationReceivedEvents.length) {
    return []
  }

  let propsArray: ModificationReceivedItemProps[] = []

  for (const event of modificationReceivedEvents) {
    switch (event.modificationType) {
      case 'actionnaire':
        propsArray.push({
          type: 'modification-information',
          date: event.date,
          modificationType: 'actionnaire',
          actionnaire: event.actionnaire,
        })
        break
      case 'producteur':
        propsArray.push({
          type: 'modification-information',
          date: event.date,
          modificationType: 'producteur',
          producteur: event.producteur,
        })
        break
      case 'fournisseurs':
        propsArray.push({
          type: 'modification-information',
          date: event.date,
          modificationType: 'fournisseurs',
          fournisseurs: event.fournisseurs,
        })
        break
    }
  }

  return propsArray
}
