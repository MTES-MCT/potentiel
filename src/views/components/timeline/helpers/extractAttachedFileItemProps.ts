import { is, ProjectEventDTO } from '@modules/frise'
import { UserRole } from '@modules/users'

export type AttachedFileItemProps = {
  type: 'fichier-attaché'
  date: number
  role: UserRole
  title: string
  description?: string
  files: { id: string; name: string }[]
  isOwner: boolean
  attachmentId: string
  projectId: string
}

export const extractAttachedFileItemProps = (
  events: ProjectEventDTO[]
): AttachedFileItemProps[] => {
  if (!events.length) {
    return []
  }
  const attachedFileEvents = events.filter(is('FileAttachedToProject'))

  if (!attachedFileEvents.length) {
    return []
  }

  return attachedFileEvents.map(
    ({ variant, date, title, description, files, isOwner, attachmentId, projectId }) => ({
      type: 'fichier-attaché',
      role: variant,
      date,
      title,
      description,
      files,
      isOwner,
      attachmentId,
      projectId,
    })
  )
}
