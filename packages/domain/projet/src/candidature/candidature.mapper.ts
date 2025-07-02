import { DateTime, Email } from '@potentiel-domain/common';

import { Fournisseur } from '../lauréat/fournisseur';

import { TypeInstallationsAgrivoltaiques, TypologieBâtiment } from '.';

import { CorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import { ImporterCandidatureUseCase } from './importer/importerCandidature.usecase';
import * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
import * as StatutCandidature from './statutCandidature.valueType';
import * as TypeTechnologie from './typeTechnologie.valueType';
import * as TypeActionnariat from './typeActionnariat.valueType';
import * as HistoriqueAbandon from './historiqueAbandon.valueType';

export const mapToCommonCandidatureUseCaseData = (
  payload: ImporterCandidatureUseCase['data'] | CorrigerCandidatureUseCase['data'],
) => ({
  statut: StatutCandidature.convertirEnValueType(payload.statutValue),
  dateÉchéanceGf: payload.dateÉchéanceGfValue
    ? DateTime.convertirEnValueType(payload.dateÉchéanceGfValue)
    : undefined,
  technologie: TypeTechnologie.convertirEnValueType(payload.technologieValue),
  typeGarantiesFinancières: payload.typeGarantiesFinancièresValue
    ? TypeGarantiesFinancières.convertirEnValueType(payload.typeGarantiesFinancièresValue)
    : undefined,
  actionnariat: payload.actionnariatValue
    ? TypeActionnariat.convertirEnValueType(payload.actionnariatValue)
    : undefined,
  historiqueAbandon: HistoriqueAbandon.convertirEnValueType(payload.historiqueAbandonValue),
  nomProjet: payload.nomProjetValue,
  localité: payload.localitéValue,
  emailContact: Email.convertirEnValueType(payload.emailContactValue),
  evaluationCarboneSimplifiée: payload.evaluationCarboneSimplifiéeValue,
  nomCandidat: payload.nomCandidatValue,
  nomReprésentantLégal: payload.nomReprésentantLégalValue,
  noteTotale: payload.noteTotaleValue,
  prixRéférence: payload.prixRéférenceValue,
  puissanceProductionAnnuelle: payload.puissanceProductionAnnuelleValue,
  motifÉlimination: payload.motifÉliminationValue,
  puissanceALaPointe: payload.puissanceALaPointeValue,
  sociétéMère: payload.sociétéMèreValue,
  territoireProjet: payload.territoireProjetValue,
  coefficientKChoisi: payload.coefficientKChoisiValue,
  typeInstallationsAgrivoltaiques: payload.typeInstallationsAgrivoltaiquesValue
    ? TypeInstallationsAgrivoltaiques.convertirEnValueType(
        payload.typeInstallationsAgrivoltaiquesValue,
      )
    : undefined,
  élémentsSousOmbrière: payload.élémentsSousOmbrièreValue,
  typologieDeBâtiment: payload.typologieDeBâtimentValue
    ? TypologieBâtiment.convertirEnValueType(payload.typologieDeBâtimentValue)
    : undefined,
  obligationDeSolarisation: payload.obligationDeSolarisationValue,
  fournisseurs: payload.fournisseursValue.map(Fournisseur.convertirEnValueType),
});
