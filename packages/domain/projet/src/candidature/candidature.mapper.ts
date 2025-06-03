import { DateTime, Email } from '@potentiel-domain/common';

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

const champsCsvFournisseur: Record<Fournisseur.TypeFournisseur.RawType, string> = {
  'module-ou-films': 'Nom du fabricant \n(Modules ou films)',
  cellules: 'Nom du fabricant (Cellules)',
  'plaquettes-silicium': 'Nom du fabricant \n(Plaquettes de silicium (wafers))',
  polysilicium: 'Nom du fabricant \n(Polysilicium)',
  'postes-conversion': 'Nom du fabricant \n(Postes de conversion)',
  structures: 'Nom du fabricant \n(Structure)',
  'dispositifs-stockage-energie': 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)',
  'dispositifs-suivi-course-soleil':
    'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)',
  'autres-technologies': 'Nom du fabricant \n(Autres technologies)',
};

export const mapToDétailsCandidatureUseCaseData = (
  payload: Record<string, string>,
): Array<{
  typeFournisseur: TypeFournisseur.RawType;
  nomDuFabricant: string;
}> => {
  const result = [];

  for (const [key, value] of Object.entries(payload)) {
    for (const [mappedKey, mappedValue] of Object.entries(champsCsvFournisseur)) {
      if (key === mappedValue) {
        result.push({
          typeFournisseur: mappedKey as Fournisseur.TypeFournisseur.RawType,
          nomDuFabricant: value,
        });
      }
    }
  }

  return result;
};
