import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import * as StatutCandidature from '../statutCandidature.valueType';
import * as TypeTechnologie from '../typeTechnologie.valueType';
import * as TypeActionnariat from '../typeActionnariat.valueType';
import { loadCandidatureFactory } from '../candidature.aggregate';
import { HistoriqueAbandon } from '../candidature';
import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';

export type ImporterCandidatureCommandCommonOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeGarantiesFinancières?: TypeGarantiesFinancières.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: string;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    département: string;
    région: string;
  };
  statut: StatutCandidature.ValueType;
  motifÉlimination?: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.ValueType;
  actionnariat?: TypeActionnariat.ValueType;
  dateÉchéanceGf?: DateTime.ValueType;
  territoireProjet: string;
};

type ImporterCandidatureCommandOptions = ImporterCandidatureCommandCommonOptions & {
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
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
        identifiantAppelOffre: payload.identifiantProjet.appelOffre,
      },
    });
    await candidature.importer(payload, appelOffre);
  };

  mediator.register('Candidature.Command.ImporterCandidature', handler);
};
