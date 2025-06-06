import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import * as StatutCandidature from '../statutCandidature.valueType';
import * as TypeTechnologie from '../typeTechnologie.valueType';
import * as TypeActionnariat from '../typeActionnariat.valueType';
import * as HistoriqueAbandon from '../historiqueAbandon.valueType';
import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../..';
import { TypeFournisseur } from '../../lauréat/fournisseur';

export type ImporterCandidatureCommand = Message<
  'Candidature.Command.ImporterCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeGarantiesFinancières?: TypeGarantiesFinancières.ValueType;
    historiqueAbandon: HistoriqueAbandon.ValueType;
    nomProjet: string;
    sociétéMère: string;
    nomCandidat: string;
    puissanceProductionAnnuelle: number;
    prixRéférence: number;
    noteTotale: number;
    nomReprésentantLégal: string;
    emailContact: Email.ValueType;
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
    fournisseurs: Array<{
      typeFournisseur: TypeFournisseur.ValueType;
      nomDuFabricant: string;
    }>;
    importéLe: DateTime.ValueType;
    importéPar: Email.ValueType;
  }
>;

export const registerImporterCandidatureCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ImporterCandidatureCommand> = async ({
    identifiantProjet,
    ...options
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    return projet.candidature.importer(options);
  };

  mediator.register('Candidature.Command.ImporterCandidature', handler);
};
