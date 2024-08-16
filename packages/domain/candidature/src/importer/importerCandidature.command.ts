import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import * as StatutCandidature from '../statutCandidature.valueType';
import * as Technologie from '../technologie.valueType';
import { loadCandidatureFactory } from '../candidature.aggregate';
import { HistoriqueAbandon } from '../candidature';

export type ImporterCandidatureCommandOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeGarantiesFinancières?: GarantiesFinancières.TypeGarantiesFinancières.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: string;
  adresse1: string;
  adresse2: string;
  codePostal: string;
  commune: string;
  statut: StatutCandidature.ValueType;
  motifÉlimination: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  valeurÉvaluationCarbone?: number;
  technologie: Technologie.ValueType;
  financementCollectif: boolean;
  financementParticipatif: boolean;
  gouvernancePartagée: boolean;
  dateÉchéanceGf?: DateTime.ValueType;
  territoireProjet: string;
  détails: Record<string, string>;
};

export type ImporterCandidatureCommand = Message<
  'Candidature.Command.ImporterCandidature',
  ImporterCandidatureCommandOptions
>;

export const registerImporterCandidatureCommand = (loadAggregate: LoadAggregate) => {
  const loadCandidatureAggregate = loadCandidatureFactory(loadAggregate);
  const handler: MessageHandler<ImporterCandidatureCommand> = async (payload) => {
    const candidature = await loadCandidatureAggregate(payload.identifiantProjet, false);

    // NB: on devrait charger l'aggregate appel d'offre au lieu de faire une query,
    // mais cela est impossible en l'absence d'évènements.
    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: payload.appelOffre,
      },
    });
    await candidature.importer(payload, appelOffre);
  };

  mediator.register('Candidature.Command.ImporterCandidature', handler);
};
