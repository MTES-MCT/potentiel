import { IdentifiantProjetValueType } from '@potentiel/domain-usecases';

export type RécupérerPorteursProjetPort = (
  identifiantProjet: IdentifiantProjetValueType,
) => Promise<Array<{ email: string; fullName: string }>>;

export * from './candidature/candidature.port';
