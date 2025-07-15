import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { Fournisseur } from '../lauréat/fournisseur';

import {
  HistoriqueAbandon,
  Localité,
  TypeActionnariat,
  TypeGarantiesFinancières,
  TypeInstallationsAgrivoltaiques,
  TypeTechnologie,
  TypologieBâtiment,
} from '.';

export type RawType = {
  nomProjet: string;
  nomCandidat: string;
  emailContact: Email.RawType;
  sociétéMère: string;
  puissanceProductionAnnuelle: number;
  nomReprésentantLégal: string;
  prixReference: number;
  localité: Localité.RawType;
  historiqueAbandon: HistoriqueAbandon.RawType;
  puissanceALaPointe: boolean;
  coefficientKChoisi: boolean | undefined;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.RawType;
  actionnariat: TypeActionnariat.RawType | undefined;
  typeGarantiesFinancières: TypeGarantiesFinancières.RawType | undefined;
  dateÉchéanceGf: DateTime.RawType | undefined;
  territoireProjet: string;
  fournisseurs: Array<Fournisseur.RawType>;
  typeInstallationsAgrivoltaiques: TypeInstallationsAgrivoltaiques.RawType | undefined;
  élémentsSousOmbrière: string | undefined;
  typologieDeBâtiment: TypologieBâtiment.RawType | undefined;
  obligationDeSolarisation: boolean | undefined;
};

export type ValueType = ReadonlyValueType<{
  nomProjet: string;
  nomCandidat: string;
  emailContact: Email.ValueType;
  sociétéMère: string;
  puissanceProductionAnnuelle: number;
  nomReprésentantLégal: string;
  prixReference: number;
  localité: Localité.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  puissanceALaPointe: boolean;
  coefficientKChoisi: boolean | undefined;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.ValueType;
  actionnariat: TypeActionnariat.ValueType | undefined;
  typeGarantiesFinancières: TypeGarantiesFinancières.ValueType | undefined;
  dateÉchéanceGf: DateTime.ValueType | undefined;
  territoireProjet: string;
  fournisseurs: Array<Fournisseur.ValueType>;
  typeInstallationsAgrivoltaiques: TypeInstallationsAgrivoltaiques.ValueType | undefined;
  élémentsSousOmbrière: string | undefined;
  typologieDeBâtiment: TypologieBâtiment.ValueType | undefined;
  obligationDeSolarisation: boolean | undefined;
  formatter(): RawType;
}>;

export const bind = (plain: PlainType<ValueType>): ValueType => ({
  nomProjet: plain.nomProjet,
  nomCandidat: plain.nomCandidat,
  nomReprésentantLégal: plain.nomReprésentantLégal,
  prixReference: plain.prixReference,
  evaluationCarboneSimplifiée: plain.evaluationCarboneSimplifiée,
  puissanceALaPointe: plain.puissanceALaPointe,
  puissanceProductionAnnuelle: plain.puissanceProductionAnnuelle,
  sociétéMère: plain.sociétéMère,
  territoireProjet: plain.territoireProjet,
  coefficientKChoisi: plain.coefficientKChoisi,
  obligationDeSolarisation: plain.obligationDeSolarisation,
  élémentsSousOmbrière: plain.élémentsSousOmbrière,

  emailContact: Email.bind(plain.emailContact),
  localité: Localité.bind(plain.localité),
  historiqueAbandon: HistoriqueAbandon.bind(plain.historiqueAbandon),
  technologie: TypeTechnologie.bind(plain.technologie),

  actionnariat: bindOptional(TypeActionnariat.bind, plain.actionnariat),
  dateÉchéanceGf: bindOptional(DateTime.bind, plain.dateÉchéanceGf),
  typeGarantiesFinancières: bindOptional(
    TypeGarantiesFinancières.bind,
    plain.typeGarantiesFinancières,
  ),
  typeInstallationsAgrivoltaiques: bindOptional(
    TypeInstallationsAgrivoltaiques.bind,
    plain.typeInstallationsAgrivoltaiques,
  ),
  typologieDeBâtiment: bindOptional(TypologieBâtiment.bind, plain.typologieDeBâtiment),

  fournisseurs: plain.fournisseurs.map(Fournisseur.bind),

  estÉgaleÀ(valueType) {
    return (
      valueType.nomProjet === this.nomProjet &&
      valueType.nomCandidat === this.nomCandidat &&
      valueType.nomReprésentantLégal === this.nomReprésentantLégal &&
      valueType.prixReference === this.prixReference &&
      valueType.evaluationCarboneSimplifiée === this.evaluationCarboneSimplifiée &&
      valueType.puissanceALaPointe === this.puissanceALaPointe &&
      valueType.coefficientKChoisi === this.coefficientKChoisi &&
      valueType.puissanceProductionAnnuelle === this.puissanceProductionAnnuelle &&
      valueType.sociétéMère === this.sociétéMère &&
      valueType.territoireProjet === this.territoireProjet &&
      valueType.élémentsSousOmbrière === this.élémentsSousOmbrière &&
      valueType.obligationDeSolarisation === this.obligationDeSolarisation &&
      areEqual(valueType.emailContact, this.emailContact) &&
      areEqual(valueType.localité, this.localité) &&
      areEqual(valueType.historiqueAbandon, this.historiqueAbandon) &&
      areEqual(valueType.technologie, this.technologie) &&
      areEqual(valueType.actionnariat, this.actionnariat) &&
      areEqual(valueType.dateÉchéanceGf, this.dateÉchéanceGf) &&
      areEqual(valueType.typeGarantiesFinancières, this.typeGarantiesFinancières) &&
      areEqual(valueType.typologieDeBâtiment, this.typologieDeBâtiment) &&
      areEqual(valueType.typeInstallationsAgrivoltaiques, this.typeInstallationsAgrivoltaiques) &&
      areEqualArrays(valueType.fournisseurs, this.fournisseurs)
    );
  },
  formatter() {
    return {
      nomCandidat: this.nomCandidat,
      nomProjet: this.nomProjet,
      nomReprésentantLégal: this.nomReprésentantLégal,
      prixReference: this.prixReference,
      evaluationCarboneSimplifiée: this.evaluationCarboneSimplifiée,
      puissanceALaPointe: this.puissanceALaPointe,
      puissanceProductionAnnuelle: this.puissanceProductionAnnuelle,
      sociétéMère: this.sociétéMère,
      territoireProjet: this.territoireProjet,
      coefficientKChoisi: this.coefficientKChoisi,
      élémentsSousOmbrière: this.élémentsSousOmbrière,
      obligationDeSolarisation: this.obligationDeSolarisation,
      emailContact: this.emailContact.formatter(),
      localité: this.localité.formatter(),
      historiqueAbandon: this.historiqueAbandon.formatter(),
      technologie: this.technologie.formatter(),
      actionnariat: this.actionnariat?.formatter(),
      dateÉchéanceGf: this.dateÉchéanceGf?.formatter(),
      typeGarantiesFinancières: this.typeGarantiesFinancières?.formatter(),
      fournisseurs: this.fournisseurs.map((fournisseur) => fournisseur.formatter()),
      typeInstallationsAgrivoltaiques: this.typeInstallationsAgrivoltaiques?.formatter(),
      typologieDeBâtiment: this.typologieDeBâtiment?.formatter(),
    };
  },
});

export type WithOptionalUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export const convertirEnValueType = (raw: WithOptionalUndefined<RawType>) =>
  bind({
    nomCandidat: raw.nomCandidat,
    nomProjet: raw.nomProjet,
    nomReprésentantLégal: raw.nomReprésentantLégal,
    prixReference: raw.prixReference,
    evaluationCarboneSimplifiée: raw.evaluationCarboneSimplifiée,
    puissanceALaPointe: raw.puissanceALaPointe,
    puissanceProductionAnnuelle: raw.puissanceProductionAnnuelle,
    sociétéMère: raw.sociétéMère,
    territoireProjet: raw.territoireProjet,
    coefficientKChoisi: raw.coefficientKChoisi,
    élémentsSousOmbrière: raw.élémentsSousOmbrière,
    obligationDeSolarisation: raw.obligationDeSolarisation,
    emailContact: Email.convertirEnValueType(raw.emailContact),
    localité: Localité.bind(raw.localité),
    historiqueAbandon: HistoriqueAbandon.convertirEnValueType(raw.historiqueAbandon),
    technologie: TypeTechnologie.convertirEnValueType(raw.technologie),
    actionnariat: bindOptional(TypeActionnariat.convertirEnValueType, raw.actionnariat),
    dateÉchéanceGf: raw.dateÉchéanceGf ? { date: raw.dateÉchéanceGf } : undefined,
    typeGarantiesFinancières: bindOptional(
      TypeGarantiesFinancières.convertirEnValueType,
      raw.typeGarantiesFinancières,
    ),
    fournisseurs: raw.fournisseurs.map(Fournisseur.convertirEnValueType),
    typeInstallationsAgrivoltaiques: bindOptional(
      TypeInstallationsAgrivoltaiques.convertirEnValueType,
      raw.typeInstallationsAgrivoltaiques,
    ),
    typologieDeBâtiment: bindOptional(
      TypologieBâtiment.convertirEnValueType,
      raw.typologieDeBâtiment,
    ),
  });

const bindOptional = <TValue, TValueType>(
  bind: (plain: TValue) => TValueType,
  plain: TValue | undefined,
): TValueType | undefined => (plain ? bind(plain) : undefined);

const areEqual = <TValueType extends ReadonlyValueType<unknown>>(
  v1: TValueType | undefined,
  v2: TValueType | undefined,
) => (v1 === undefined ? v2 === undefined : v2 !== undefined && v1.estÉgaleÀ(v2));

const areEqualArrays = <TValueType extends ReadonlyValueType<unknown>>(
  v1: TValueType[],
  v2: TValueType[],
) => v1.length === v2.length && !v1.find((v, i) => !v2[i].estÉgaleÀ(v));
