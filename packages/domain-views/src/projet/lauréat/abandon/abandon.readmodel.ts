import { ReadModel } from '@potentiel/core-domain-views';
import { RawIdentifiantProjet, StatusAbandon } from '@potentiel/domain';

export type AbandonReadModelKey = `abandon|${RawIdentifiantProjet}`;

export type AbandonReadModel = ReadModel<
  'abandon',
  {
    status: StatusAbandon;

    appelOffre: string;
    numéroCRE: string;
    famille?: string;
    période: string;

    //flatten organization to optimize complex query. Will be revised soon
    demandeRaison: string;
    demandePiéceJustificativeFormat: string;
    demandeRecandidature: boolean;
    demandeDemandéLe: string;
  }
>;

export type PiéceJustificativeAbandonProjetReadModel = ReadModel<
  'piéce-justificative-abandon-projet',
  { format: string; content: ReadableStream }
>;
