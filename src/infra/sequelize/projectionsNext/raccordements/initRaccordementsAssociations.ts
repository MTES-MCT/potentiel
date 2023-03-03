import { File } from '../file/file.model';
import { User } from '../users/users.model';
import { Raccordements } from './raccordements.model';

export const initRaccordementsModelAssociations = () => {
  Raccordements.hasOne(File, {
    foreignKey: 'id',
    sourceKey: 'ptfFichierId',
    as: 'ptfFichier',
  });

  Raccordements.hasOne(User, {
    foreignKey: 'id',
    sourceKey: 'ptfEnvoyéePar',
    as: 'ptfEnvoyéeParRef',
  });
};
