import { is, ProjectEventDTO } from '../../../../modules/frise'

export type ImportItemProps = {
  type: 'import'
  date: number
}

export const extractImportItemProps = (events: ProjectEventDTO[]): ImportItemProps | null => {
  if (events.find(is('ProjectNotified'))) {
    return null
  }

  const importedEvent = events.find(is('ProjectImported'))

  return importedEvent
    ? {
        type: 'import',
        date: importedEvent.date,
      }
    : null
}
