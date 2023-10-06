import { IdentifiantProjetValueType } from '@potentiel/domain';

export type RécupérerPorteursProjetPort = (
  identifiantProjet: IdentifiantProjetValueType,
) => Promise<Array<{ email: string; fullName: string }>>;

export * from './lauréat/abandon/abandon.port';
export * from './candidature/candidature.port';
