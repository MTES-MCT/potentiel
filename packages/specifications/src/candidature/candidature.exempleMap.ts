import { PlainType } from '@potentiel-domain/core';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import {
  FieldToExempleMapper,
  mapBoolean,
  mapDateTime,
  mapNumber,
  mapOptionalBoolean,
  mapValueType,
} from '../helpers/mapToExemple';

export const dépôtExempleMap: FieldToExempleMapper<
  Omit<Candidature.Dépôt.RawType, 'localité' | 'fournisseurs'>
> = {
  typeGarantiesFinancières: [
    'type GF',
    mapValueType(Candidature.TypeGarantiesFinancières.convertirEnValueType),
  ],
  technologie: ['technologie', mapValueType(Candidature.TypeTechnologie.convertirEnValueType)],
  historiqueAbandon: [
    'historique abandon',
    mapValueType(Candidature.HistoriqueAbandon.convertirEnValueType),
  ],
  actionnariat: ['actionnariat', mapValueType(Candidature.TypeActionnariat.convertirEnValueType)],
  typeInstallationsAgrivoltaiques: [
    'installations agrivoltaïques',
    mapValueType(Candidature.TypeInstallationsAgrivoltaiques.convertirEnValueType),
  ],
  typologieDeBâtiment: [
    'typologie de bâtiment',
    mapValueType(Candidature.TypologieBâtiment.convertirEnValueType),
  ],
  nomProjet: ['nom projet'],
  nomCandidat: ['nom candidat'],
  emailContact: ['email contact'],
  sociétéMère: ['société mère'],
  territoireProjet: ['territoire projet'],
  nomReprésentantLégal: ['nom représentant légal'],
  élémentsSousOmbrière: ['éléments sous ombrière'],
  dateÉchéanceGf: ["date d'échéance", mapDateTime],
  dateDélibérationGf: ['date de délibération', mapDateTime],
  puissanceProductionAnnuelle: ['puissance production annuelle', mapNumber],
  prixReference: ['prix reference', mapNumber],
  evaluationCarboneSimplifiée: ['évaluation carbone simplifiée', mapNumber],
  puissanceALaPointe: ['puissance à la pointe', mapBoolean],
  obligationDeSolarisation: ['obligation de solarisation', mapOptionalBoolean],
  coefficientKChoisi: ['coefficient K choisi', mapOptionalBoolean],
};

export const instructionExempleMap: FieldToExempleMapper<Candidature.Instruction.RawType> = {
  statut: ['statut', mapValueType(Candidature.StatutCandidature.convertirEnValueType)],
  motifÉlimination: ["motif d'élimination", (val) => val],
  noteTotale: ['note totale', mapNumber],
};

export const identifiantProjetExempleMap: FieldToExempleMapper<
  PlainType<IdentifiantProjet.ValueType>
> = {
  appelOffre: ["appel d'offre"],
  période: ['période'],
  famille: ['famille'],
  numéroCRE: ['numéro CRE'],
};

export const localitéExempleMap: FieldToExempleMapper<Candidature.Localité.RawType> = {
  adresse1: ['adresse 1'],
  adresse2: ['adresse 2'],
  codePostal: ['code postal'],
  commune: ['commune'],
  région: ['région'],
  département: ['département'],
};
