import { Project } from '../../../../entities'
import { ProjectEvent } from '../../projectionsNext'

export const getLegacyModificationByFilename = async (
  filename: string
): Promise<Project['id'][]> => {
  const legacyModificationEvents = await ProjectEvent.findAll({
    where: { type: 'LegacyModificationImported', 'payload.filename': filename },
    attributes: ['projectId'],
  })

  if (!legacyModificationEvents.length) return []

  return legacyModificationEvents.map((item: any) => item.projectId)
}
