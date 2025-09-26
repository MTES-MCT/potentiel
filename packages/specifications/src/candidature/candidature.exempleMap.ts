import { PlainType } from '@potentiel-domain/core';
import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import {
  FieldToExempleMapper,
  mapBoolean,
  mapDateTime,
  mapNumber,
  mapOptionalBoolean,
  mapValueType,
} from '../helpers/mapToExemple';

export const dépôtExempleMap: FieldToExempleMapper<
  Omit<
    Candidature.Dépôt.RawType,
    | 'localité'
    | 'fournisseurs'
    | 'autorisationDUrbanisme'
    | 'typologieInstallation'
    | 'attestationConstitutionGf'
  >
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
  nomProjet: ['nom projet'],
  nomCandidat: ['nom candidat'],
  emailContact: ['email contact'],
  sociétéMère: ['société mère'],
  territoireProjet: ['territoire projet'],
  nomReprésentantLégal: ['nom représentant légal'],
  dateÉchéanceGf: ["date d'échéance", mapDateTime],
  dateConstitutionGf: ['date de constitution', mapDateTime],
  puissanceProductionAnnuelle: ['puissance production annuelle', mapNumber],
  prixReference: ['prix reference', mapNumber],
  evaluationCarboneSimplifiée: ['évaluation carbone simplifiée', mapNumber],
  puissanceALaPointe: ['puissance à la pointe', mapBoolean],
  obligationDeSolarisation: ['obligation de solarisation', mapOptionalBoolean],
  coefficientKChoisi: ['coefficient K choisi', mapOptionalBoolean],
  puissanceDeSite: ['puissance de site', mapNumber],
  installateur: ['installateur'],
  installationAvecDispositifDeStockage: [
    'installation avec dispositif de stockage',
    mapOptionalBoolean,
  ],
  natureDeLExploitation: [
    "nature de l'exploitation",
    mapValueType(Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.convertirEnValueType),
  ],
};

export const instructionExempleMap: FieldToExempleMapper<Candidature.Instruction.RawType> = {
  statut: ['statut', mapValueType(Candidature.StatutCandidature.convertirEnValueType)],
  motifÉlimination: ["motif d'élimination", (val) => val],
  noteTotale: ['note totale', mapNumber],
};

export const identifiantProjetExempleMap: FieldToExempleMapper<
  PlainType<IdentifiantProjet.ValueType>
> = {
  appelOffre: ["appel d'offres"],
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

export const autorisationDUrbanismeExempleMap: FieldToExempleMapper<{
  numéro: string;
  date: DateTime.RawType;
}> = {
  date: [`date d'obtention de l'autorisation d'urbanisme`, mapDateTime],
  numéro: [`numéro de l'autorisation d'urbanisme`],
};
