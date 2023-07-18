import { InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { User } from '../users/users.model';
import { File } from '../file/file.model';

export const garantiesFinancièresStatuts = ['en attente', 'à traiter', 'validé'] as const;
export type GarantiesFinancièresStatut = typeof garantiesFinancièresStatuts[number];

export class GarantiesFinancières extends Model<
  InferAttributes<GarantiesFinancières>,
  InferCreationAttributes<GarantiesFinancières>
> {
  id: string;
  projetId: string;
  statut: GarantiesFinancièresStatut;
  soumisesALaCandidature: boolean;
  dateLimiteEnvoi: Date | null;
  fichierId: string | null;
  dateEnvoi: Date | null;
  envoyéesPar: string | null;
  dateConstitution: Date | null;
  type: string | null;
  dateEchéance: Date | null;
  validéesPar: string | null;
  validéesLe: Date | null;
  envoyéesParRef: NonAttribute<User> | null;
  fichier: NonAttribute<File> | null;
}
