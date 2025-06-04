import { DateTime, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { Fournisseur } from '../lauréat';
import { TypeFournisseur } from '../lauréat/fournisseur';

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
});

// Etat actuel des colonnes du CSV
const champsCsvFournisseur: Record<Fournisseur.TypeFournisseur.RawType, string> = {
  'module-ou-films': 'Modules ou films',
  cellules: 'Cellules',
  'plaquettes-silicium': 'Plaquettes de silicium (wafers)',
  polysilicium: 'Polysilicium',
  'postes-conversion': 'Postes de conversion',
  structure: 'Structure',
  'dispositifs-stockage-energie': 'Dispositifs de stockage de l’énergie *',
  'dispositifs-suivi-course-soleil': 'Dispositifs de suivi de la course du soleil *',
  'autres-technologies': 'Autres technologies',
  'dispositif-de-production': 'dispositif de production',
  'dispositif-de-stockage': 'Dispositif de stockage',
  'poste-conversion': 'Poste de conversion',
};

// on garde le sens "type" -> "label CSV" ci-dessus pour bénéficier du typage exhaustif
// mais on l'inverse pour l'utilisation
const labelCsvToTypeFournisseur = Object.fromEntries(
  Object.entries(champsCsvFournisseur).map(([key, value]) => [value, key]),
) as Record<string, Fournisseur.TypeFournisseur.RawType>;

const regex = /Nom du fabricant\s?\s\((?<type>.*)\)\s?\d?/;
export const mapCsvLabelToTypeFournisseur = (typeValue: string) => {
  const type = typeValue.match(regex)?.groups?.type;
  if (type && labelCsvToTypeFournisseur[type]) {
    return TypeFournisseur.convertirEnValueType(labelCsvToTypeFournisseur[type]);
  }
  return Option.none;
};

export const mapToDétailsCandidatureUseCaseData = (payload: Record<string, string>) => {
  const fournisseurs: Array<{
    typeFournisseur: TypeFournisseur.ValueType;
    nomDuFabricant: string;
  }> = [];

  for (const [key, value] of Object.entries(payload)) {
    const type = mapCsvLabelToTypeFournisseur(key);
    if (Option.isNone(type)) {
      continue;
    }

    fournisseurs.push({
      typeFournisseur: type,
      nomDuFabricant: value,
    });
  }

  return { fournisseurs };
};
