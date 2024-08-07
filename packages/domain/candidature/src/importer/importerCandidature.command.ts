import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import * as StatutCandidature from '../statutCandidature.valueType';
import * as Technologie from '../technologie.valueType';
import { loadCandidatureAggregateFactory } from '../candidature.aggregate';

export type ImporterCandidatureCommand = Message<
  'Candidature.Command.ImporterCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeGarantiesFinancières?: string;
    historiqueAbandon: string;
    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;
    nomProjet: string;
    sociétéMère?: string;
    nomCandidat: string;
    puissanceProductionAnnuelle: number;
    prixReference: number;
    noteTotale: number;
    nomReprésentantLégal: string;
    emailContact: string;
    adresse1: string;
    adresse2?: string;
    codePostal: string;
    commune: string;
    statut: StatutCandidature.ValueType;
    motifÉlimination?: string;
    puissanceALaPointe?: boolean;
    evaluationCarboneSimplifiée: number | 'N/A';
    valeurÉvaluationCarbone?: number;
    technologie?: Technologie.ValueType;
    financementCollectif: boolean;
    gouvernancePartagée: boolean;
    dateÉchéanceGf?: DateTime.ValueType;

    détails?: Record<string, string>;
  }
>;

export const registerImporterCandidatureCommand = (loadAggregate: LoadAggregate) => {
  const loadCandidatureAggregate = loadCandidatureAggregateFactory(loadAggregate);
  const handler: MessageHandler<ImporterCandidatureCommand> = async (payload) => {
    const candidature = await loadCandidatureAggregate(payload.identifiantProjet);
    await candidature.instruire(payload);
  };

  mediator.register('Candidature.Command.ImporterCandidature', handler);
};
