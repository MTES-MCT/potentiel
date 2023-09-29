import { RawIdentifiantProjet, RéponseSignée } from '@potentiel/domain';

export type RécupérerPiéceJustificativeAbandonProjetPort = (
  identifiantProjet: RawIdentifiantProjet,
  format: string,
) => Promise<ReadableStream | undefined>;

export type RécupérerRéponseSignée = (
  IdentifiantProjet: RawIdentifiantProjet,
  type: RéponseSignée['type'],
  format: string,
) => Promise<ReadableStream | undefined>;
