import { Op } from 'sequelize';
import { ok, Result, wrapInfra } from '@core/utils';
import { getFullTextSearchOptions } from '@dataAccess/db';
import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { User } from '@entities';
import { makePaginatedList, paginate } from '../../../../helpers/paginate';
import {
  GetModificationRequestListForPorteur,
  ModificationRequestListItemDTO,
} from '@modules/modificationRequest';
import { InfraNotAvailableError } from '@modules/shared';
import { PaginatedList } from '../../../../types';
import {
  ModificationRequest,
  Project,
  User as UserModel,
  UserProjects,
  File,
} from '@infra/sequelize/projectionsNext';

export const getModificationRequestListForPorteur: GetModificationRequestListForPorteur = ({
  user,
  appelOffreId,
  periodeId,
  familleId,
  modificationRequestType,
  modificationRequestStatus,
  pagination,
  recherche,
}) => {
  return _getProjectIdsForUser(user)
    .andThen((projectIds) => {
      return wrapInfra(
        ModificationRequest.findAndCountAll({
          where: {
            isLegacy: {
              [Op.or]: [false, null],
            },
            projectId: {
              [Op.in]: projectIds,
            },
            ...(modificationRequestType && { type: modificationRequestType }),
            ...(modificationRequestStatus && { status: modificationRequestStatus }),
          },
          include: [
            {
              model: Project,
              as: 'project',
              attributes: [
                'appelOffreId',
                'periodeId',
                'familleId',
                'nomProjet',
                'communeProjet',
                'departementProjet',
                'regionProjet',
              ],
              where: {
                ...(recherche && { [Op.or]: { ...getFullTextSearchOptions(recherche) } }),
                ...(appelOffreId && { appelOffreId }),
                ...(periodeId && { periodeId }),
                ...(familleId && { familleId }),
              },
              required: true,
            },
            {
              model: UserModel,
              as: 'requestedBy',
              attributes: ['fullName', 'email'],
              required: true,
            },
            {
              model: File,
              as: 'attachmentFile',
              attributes: ['id', 'filename'],
              required: false,
            },
          ],
          order: [['createdAt', 'DESC']],
          ...paginate(pagination),
        }),
      );
    })
    .andThen(
      (res): Result<PaginatedList<ModificationRequestListItemDTO>, InfraNotAvailableError> => {
        const { count, rows } = res;

        const modificationRequests = rows.map(
          ({
            id,
            status,
            requestedOn,
            type,
            justification,
            actionnaire,
            producteur,
            puissance,
            requestedBy: { email, fullName },
            project: {
              nomProjet,
              communeProjet,
              departementProjet,
              regionProjet,
              appelOffreId,
              periodeId,
              familleId,
            },
            attachmentFile,
          }) => {
            const getDescription = (): string => {
              switch (type) {
                case 'abandon':
                case 'recours':
                case 'fournisseur':
                case 'delai':
                case 'annulation abandon':
                  return justification || '';
                case 'actionnaire':
                  return actionnaire || '';
                case 'producteur':
                  return producteur || '';
                case 'puissance':
                  return puissance
                    ? `${puissance} ${_getPuissanceForAppelOffre({
                        appelOffreId,
                        periodeId,
                      })}`
                    : '';
                case 'autre':
                  return 'autre (legacy)';
              }
            };

            return {
              id,
              status,
              requestedOn,
              requestedBy: {
                email,
                fullName,
              },
              attachmentFile,
              project: {
                nomProjet,
                communeProjet,
                departementProjet,
                regionProjet,
                appelOffreId,
                periodeId,
                familleId,
                unitePuissance: _getPuissanceForAppelOffre({ appelOffreId, periodeId }),
              },
              type,
              description: getDescription(),
            };
          },
        );

        return ok(makePaginatedList(modificationRequests, count, pagination));
      },
    );
};

const _getPuissanceForAppelOffre = (args: { appelOffreId: string; periodeId: string }): string => {
  return getProjectAppelOffre(args)?.unitePuissance || 'unité de puissance';
};

const _getProjectIdsForUser = (user: User) => {
  return wrapInfra(
    UserProjects.findAll({
      attributes: ['projectId'],
      where: {
        userId: user.id,
      },
    }),
  ).map((items: any) => items.map((item) => item.projectId));
};
