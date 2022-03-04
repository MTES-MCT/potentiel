import { is, ProjectEventDTO } from '@modules/frise'
import { Fournisseur } from '@modules/project'

export type ModificationReceivedItemProps = {
  type: 'modification-information'
  date: number
} & (
  | { modificationType: 'actionnaire'; actionnaire: string }
  | { modificationType: 'producteur'; producteur: string }
  | { modificationType: 'fournisseur'; fournisseurs: Fournisseur[] }
  | { modificationType: 'puissance'; puissance: number; unitePuissance: string }
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
      case 'fournisseur':
        propsArray.push({
          type: 'modification-information',
          date: event.date,
          modificationType: 'fournisseur',
          fournisseurs: event.fournisseurs,
        })
        break
      case 'puissance':
        propsArray.push({
          type: 'modification-information',
          date: event.date,
          modificationType: 'puissance',
          puissance: event.puissance,
          unitePuissance: event.unitePuissance || '??',
        })
        break
    }
  }

  return propsArray
}
