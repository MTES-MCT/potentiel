import { Op } from 'sequelize';
import { errAsync, ok, okAsync, Result, ResultAsync, wrapInfra } from '@core/utils';
import { getFullTextSearchOptions } from '@dataAccess/db';
import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { User } from '@entities';
import { makePaginatedList, mapToOffsetAndLimit } from '../pagination';
import {
  GetModificationRequestListForAdmin,
  ModificationRequestListItemDTO,
} from '@modules/modificationRequest';
import { InfraNotAvailableError } from '@modules/shared';
import { userIs } from '@modules/users';
import {
  ModificationRequest,
  Project,
  User as UserModel,
  UserDreal,
  File,
} from '@infra/sequelize/projectionsNext';
import { PaginatedList } from '@modules/pagination';

function _getPuissanceForAppelOffre(args: { appelOffreId; periodeId }): string {
  return getProjectAppelOffre(args)?.unitePuissance || 'unité de puissance';
}

function _getDrealRegionsForUser(user: User) {
  if (user.role !== 'dreal') {
    return okAsync<any, InfraNotAvailableError>([]);
  }

  if (!UserDreal) return errAsync(new InfraNotAvailableError());

  return ResultAsync.fromPromise(
    UserDreal.findAll({
      attributes: ['dreal'],
      where: {
        userId: user.id,
      },
    }),
    (e) => {
      console.error(e);
      return new InfraNotAvailableError();
    },
  ).map((items: any) => items.map((item) => item.dreal));
}

export const getModificationRequestListForAdmin: GetModificationRequestListForAdmin = ({
  user,
  appelOffreId,
  periodeId,
  familleId,
  modificationRequestType,
  modificationRequestStatus,
  pagination,
  recherche,
  forceNoAuthority,
}) => {
  return _getDrealRegionsForUser(user)
    .andThen((drealRegions) => {
      const projectOpts = {
        where: {
          ...(recherche && { [Op.or]: { ...getFullTextSearchOptions(recherche) } }),
          ...(appelOffreId && { appelOffreId }),
          ...(periodeId && { periodeId }),
          ...(familleId && { familleId }),
          ...(userIs('dreal')(user) && { regionProjet: drealRegions }),
        },
      };

      const opts = {
        where: {
          isLegacy: {
            [Op.or]: [false, null],
          },
          ...(userIs('dreal')(user) && { authority: 'dreal' }),
          ...(userIs(['admin', 'dgec-validateur'])(user) &&
            !forceNoAuthority && { authority: 'dgec' }),
          ...(modificationRequestType && { type: modificationRequestType }),
          ...(modificationRequestStatus && { status: modificationRequestStatus }),
        },
      };

      return wrapInfra(
        ModificationRequest.findAndCountAll({
          ...opts,
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
              ...projectOpts,
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
          ...(pagination && mapToOffsetAndLimit(pagination)),
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
