import { ReadModel } from '@potentiel/core-domain-views';
import { RawIdentifiantProjet, StatusAbandon } from '@potentiel/domain';

export type AbandonReadModelKey = `abandon|${RawIdentifiantProjet}`;

export type AbandonReadModel = ReadModel<
  'abandon',
  {
    status: StatusAbandon;
    piéceJustificative: {
      format: string;
    };
    recandidature: boolean;
    demandéLe: string;
  }
>;

export type PiéceJustificativeAbandonProjetReadModel = ReadModel<
  'piéce-justificative-abandon-projet',
  { format: string; content: ReadableStream }
>;
