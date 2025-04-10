import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import * as Localité from './localité.valueType';
import * as TypeTechnologie from './typeTechnologie.valueType';
import * as TypeActionnariat from './typeActionnariat.valueType';
import * as HistoriqueAbandon from './historiqueAbandon.valueType';
import * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';

export type ValueType = ReadonlyValueType<{
  typeGarantiesFinancières?: TypeGarantiesFinancières.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixRéférence: number;
  nomReprésentantLégal: string;
  emailContact: Email.ValueType;
  localité: Localité.ValueType;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.ValueType;
  actionnariat?: TypeActionnariat.ValueType;
  dateÉchéanceGf?: DateTime.ValueType;
  territoireProjet: string;
  coefficientKChoisi?: boolean;
}>;

export const bind = ({
  dateÉchéanceGf,
  emailContact,
  typeGarantiesFinancières,
  historiqueAbandon,
  localité,
  technologie,
  actionnariat,
  ...otherData
}: PlainType<ValueType>): ValueType => {
  return {
    dateÉchéanceGf: dateÉchéanceGf ? DateTime.bind(dateÉchéanceGf) : undefined,
    emailContact: Email.bind(emailContact),
    typeGarantiesFinancières: typeGarantiesFinancières
      ? TypeGarantiesFinancières.bind(typeGarantiesFinancières)
      : undefined,
    historiqueAbandon: HistoriqueAbandon.bind(historiqueAbandon),
    localité: Localité.bind(localité),
    technologie: TypeTechnologie.bind(technologie),
    actionnariat: actionnariat ? TypeActionnariat.bind(actionnariat) : undefined,
    ...otherData,
    estÉgaleÀ(value) {
      return (
        this.emailContact.estÉgaleÀ(value.emailContact) &&
        this.evaluationCarboneSimplifiée === value.evaluationCarboneSimplifiée &&
        this.historiqueAbandon?.estÉgaleÀ(value.historiqueAbandon) &&
        this.localité?.estÉgaleÀ(Localité.bind(localité)) &&
        this.nomCandidat === value.nomCandidat &&
        this.nomProjet === value.nomProjet &&
        this.nomReprésentantLégal === value.nomReprésentantLégal &&
        this.prixRéférence === value.prixRéférence &&
        this.puissanceALaPointe === value.puissanceALaPointe &&
        this.puissanceProductionAnnuelle === value.puissanceProductionAnnuelle &&
        this.sociétéMère === value.sociétéMère &&
        this.technologie?.estÉgaleÀ(value.technologie) &&
        this.territoireProjet === value.territoireProjet &&
        this.coefficientKChoisi === value.coefficientKChoisi &&
        (value.actionnariat === undefined
          ? this.actionnariat === undefined
          : !!this.actionnariat?.estÉgaleÀ(value.actionnariat)) &&
        this.dateÉchéanceGf === value.dateÉchéanceGf &&
        (value.typeGarantiesFinancières === undefined
          ? this.typeGarantiesFinancières === undefined
          : !!this.typeGarantiesFinancières?.estÉgaleÀ(value.typeGarantiesFinancières))
      );
    },
  };
};
