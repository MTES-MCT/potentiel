import { AppelOffre } from '@potentiel-domain/appel-offre';
import cloneDeep from 'lodash/cloneDeep';

import { errAsync, okAsync } from '../../core/utils';
import { EntityNotFoundError } from '../../modules/shared';
import { AppelOffreRepo } from '../appelOffre';
import { appelsOffreStatic } from './appelOffreStatic';

const appelOffreRepo: AppelOffreRepo = {
  findAll: async () => {
    return appelsOffreStatic;
  },
  findById: async (id: AppelOffre.AppelOffreReadModel['id']) => {
    return cloneDeep(appelsOffreStatic.find((ao) => ao.id === id));
  },
  getPeriodeTitle: (
    appelOffreId: AppelOffre.AppelOffreReadModel['id'],
    periodeId: AppelOffre.Periode['id'],
  ) => {
    const appelOffre = appelsOffreStatic.find((ao) => ao.id === appelOffreId);

    if (!appelOffre) return errAsync(new EntityNotFoundError());

    const periode = appelOffre.periodes.find((periode) => periode.id === periodeId);

    if (!periode) return errAsync(new EntityNotFoundError());

    return okAsync({
      periodeTitle: periode.title,
      appelOffreTitle: appelOffre.shortTitle,
    });
  },
};

export { AppelOffreRepo, appelOffreRepo };
