import { IdentifiantProjetValueType } from '@potentiel/domain';
import { LegacyProjetReadModel } from './projet.readModel';
import { Option } from '@potentiel/monads';

export type RécupérerDétailProjetPort = (
  identifiantProjet: IdentifiantProjetValueType,
) => Promise<Option<Omit<LegacyProjetReadModel, 'type' | 'identifiantGestionnaire'>>>;

export type RécupérerPiéceJustificativeAbandonProjetPort = (
  identifiantProjet: string,
  format: string,
) => Promise<ReadableStream | undefined>;
