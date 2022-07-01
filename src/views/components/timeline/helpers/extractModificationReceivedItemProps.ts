import { is, ProjectEventDTO } from '@modules/frise'
import { Fournisseur } from '@modules/project'
import ROUTES from '@routes'

export type ModificationReceivedItemProps = {
  type: 'modification-information'
  date: number
  detailsUrl: string
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
    const detailsUrl = ROUTES.DEMANDE_PAGE_DETAILS(event.modificationRequestId)
    switch (event.modificationType) {
      case 'actionnaire':
        propsArray.push({
          type: 'modification-information',
          date: event.date,
          modificationType: 'actionnaire',
          actionnaire: event.actionnaire,
          detailsUrl,
        })
        break
      case 'producteur':
        propsArray.push({
          type: 'modification-information',
          date: event.date,
          modificationType: 'producteur',
          producteur: event.producteur,
          detailsUrl,
        })
        break
      case 'fournisseur':
        propsArray.push({
          type: 'modification-information',
          date: event.date,
          modificationType: 'fournisseur',
          fournisseurs: event.fournisseurs,
          detailsUrl,
        })
        break
      case 'puissance':
        propsArray.push({
          type: 'modification-information',
          date: event.date,
          modificationType: 'puissance',
          puissance: event.puissance,
          unitePuissance: event.unitePuissance || '??',
          detailsUrl,
        })
        break
    }
  }

  return propsArray
}
