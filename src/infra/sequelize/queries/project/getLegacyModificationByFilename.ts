import { ProjectEvent } from '@infra/sequelize/projectionsNext';
import { Project } from '../../../../entities';

export const getLegacyModificationByFilename = async (
  filename: string,
): Promise<Project['id'][]> => {
  const legacyModificationEvents = await ProjectEvent.findAll({
    where: { type: 'LegacyModificationImported', 'payload.filename': filename },
    attributes: ['projectId'],
  });

  if (!legacyModificationEvents.length) return [];

  const projectIds = new Set<string>();
  for (const item of legacyModificationEvents) {
    projectIds.add((item as any).projectId);
  }
  return Array.from(projectIds);
};
