import { ResultAsync, errAsync, okAsync } from '../../../core/utils';
import { EntityNotFoundError } from '../../../modules/shared';
import { appelsOffreStatic } from '../appelOffreStatic';
import { AppelOffre } from '@potentiel/domain-views';

export const getAppelOffre: (
  appelOffreId: string,
) => ResultAsync<AppelOffre, EntityNotFoundError> = (appelOffreId) => {
  const appelOffre = appelsOffreStatic.find((ao) => ao.id === appelOffreId);

  return appelOffre ? okAsync(appelOffre) : errAsync(new EntityNotFoundError());
};
