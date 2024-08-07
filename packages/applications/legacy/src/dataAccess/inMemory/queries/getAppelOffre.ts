import { ResultAsync, errAsync, okAsync } from '../../../core/utils';
import { EntityNotFoundError } from '../../../modules/shared';
import { appelsOffreStatic } from '../appelOffreStatic';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export const getAppelOffre: (
  appelOffreId: string,
) => ResultAsync<AppelOffre.AppelOffreReadModel, EntityNotFoundError> = (appelOffreId) => {
  const appelOffre = appelsOffreStatic.find((ao) => ao.id === appelOffreId);

  return appelOffre ? okAsync(appelOffre) : errAsync(new EntityNotFoundError());
};
