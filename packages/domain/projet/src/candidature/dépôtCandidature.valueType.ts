import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import * as Localité from './localité.valueType';
import * as TypeTechnologie from './typeTechnologie.valueType';
import * as TypeActionnariat from './typeActionnariat.valueType';
import * as HistoriqueAbandon from './historiqueAbandon.valueType';
import * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
import * as StatutCandidature from './statutCandidature.valueType';

export type ValueType = ReadonlyValueType<{
  typeGarantiesFinancières?: TypeGarantiesFinancières.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixRéférence: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: string;
  localité: Localité.ValueType;
  statut: StatutCandidature.ValueType;
  motifÉlimination?: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.ValueType;
  actionnariat?: TypeActionnariat.ValueType;
  dateÉchéanceGf?: string;
  territoireProjet: string;
  détails: Record<string, string>;
}>;

export const bind = ({
  typeGarantiesFinancières,
  historiqueAbandon,
  localité,
  technologie,
  actionnariat,
  statut,
  ...otherData
}: PlainType<ValueType>): ValueType => {
  return {
    typeGarantiesFinancières: typeGarantiesFinancières
      ? TypeGarantiesFinancières.convertirEnValueType(typeGarantiesFinancières.type)
      : undefined,
    historiqueAbandon: HistoriqueAbandon.convertirEnValueType(historiqueAbandon.type),
    localité: Localité.bind(localité),
    technologie: TypeTechnologie.convertirEnValueType(technologie.type),
    actionnariat: actionnariat
      ? TypeActionnariat.convertirEnValueType(actionnariat.type)
      : undefined,
    statut: StatutCandidature.bind(statut),
    ...otherData,
    estÉgaleÀ() {
      return true;
    },
  };
};
