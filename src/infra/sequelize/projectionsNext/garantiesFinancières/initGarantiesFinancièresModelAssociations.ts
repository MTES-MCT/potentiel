import { File } from '../file/file.model';
import { User } from '../users/users.model';
import { GarantiesFinancières } from './garantiesFinancières.model';

export const initGarantiesFinancièresModelAssociations = () => {
  GarantiesFinancières.hasOne(File, {
    foreignKey: 'id',
    sourceKey: 'fichierId',
    as: 'fichier',
  });

  GarantiesFinancières.hasOne(User, {
    foreignKey: 'id',
    sourceKey: 'envoyéesPar',
    as: 'envoyéesParRef',
  });

  GarantiesFinancières.hasOne(User, {
    foreignKey: 'id',
    sourceKey: 'validéesPar',
    as: 'validéesParRef',
  });
};
