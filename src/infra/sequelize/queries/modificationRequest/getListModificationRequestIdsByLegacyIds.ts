import { ModificationRequest, Project } from '../../projectionsNext';
import { Op } from 'sequelize';

export const getListModificationRequestIdsByLegacyIds = async (
  projetsLegacyIds: Array<Project['id']>,
) => {
  if (!projetsLegacyIds || !projetsLegacyIds.length) {
    return [];
  }

  try {
    const modificationRequests = await ModificationRequest.findAll({
      where: {
        projectId: {
          [Op.in]: projetsLegacyIds,
        },
      },
      raw: true,
      attributes: ['id'],
    });

    return modificationRequests.map((mr) => mr.id);
  } catch (error) {
    throw new Error(error);
  }
};
