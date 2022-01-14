import { isProjectImported, isProjectNotified, ProjectEventDTO } from '../../../../modules/frise'

export type ImportItemProps = {
  type: 'import'
  date: number
}

export const extractImportItemProps = (events: ProjectEventDTO[]): ImportItemProps | null => {
  if (events.find(isProjectNotified)) {
    return null
  }

  const importedEvent = events.find(isProjectImported)

  return importedEvent
    ? {
        type: 'import',
        date: importedEvent.date,
      }
    : null
}
