import { AppelOffre, Famille, Periode } from '@potentiel/domain-views';
import cloneDeep from 'lodash/cloneDeep';

import { errAsync, okAsync } from '../../core/utils';
import { EntityNotFoundError } from '../../modules/shared';
import { AppelOffreRepo } from '../appelOffre';
import { appelsOffreStatic } from './appelOffreStatic';

const appelOffreRepo: AppelOffreRepo = {
  findAll: async () => {
    return appelsOffreStatic;
  },
  findById: async (id: AppelOffre['id']) => {
    return cloneDeep(appelsOffreStatic.find((ao) => ao.id === id));
  },
  getFamille: (appelOffreId: AppelOffre['id'], familleId: Famille['id']) => {
    const appelOffre = appelsOffreStatic.find((ao) => ao.id === appelOffreId);

    if (!appelOffre) return errAsync(new EntityNotFoundError());

    const famille = appelOffre.familles.find((famille) => famille.id === familleId);

    if (!famille) return errAsync(new EntityNotFoundError());

    return okAsync(famille);
  },
  getPeriodeTitle: (appelOffreId: AppelOffre['id'], periodeId: Periode['id']) => {
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
