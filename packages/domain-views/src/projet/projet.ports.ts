import { IdentifiantProjetValueType } from '@potentiel/domain';
import { ProjetReadModel } from './projet.readModel';
import { Option } from '@potentiel/monads';

export type RécupérerDétailProjetPort = (
  identifiantProjet: IdentifiantProjetValueType,
) => Promise<Option<Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>>>;

export type RécupérerPorteursProjetPort = (
  identifiantProjet: IdentifiantProjetValueType,
) => Promise<Array<{ email: string; fullName: string }>>;
