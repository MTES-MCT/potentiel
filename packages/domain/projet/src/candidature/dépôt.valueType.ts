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

export const bind = ({
  nomProjet,
  nomCandidat,
  emailContact,
  sociétéMère,
  puissanceProductionAnnuelle,
  nomReprésentantLégal,
  prixReference,
  localité,
  historiqueAbandon,
  puissanceALaPointe,
  coefficientKChoisi,
  evaluationCarboneSimplifiée,
  technologie,
  actionnariat,
  typeGarantiesFinancières,
  dateÉchéanceGf,
  territoireProjet,
  fournisseurs,
  typeInstallationsAgrivoltaiques,
  élémentsSousOmbrière,
  typologieDeBâtiment,
  obligationDeSolarisation,
}: PlainType<ValueType>): ValueType => ({
  nomProjet,
  nomCandidat,
  nomReprésentantLégal,
  prixReference,
  evaluationCarboneSimplifiée,
  puissanceALaPointe,
  puissanceProductionAnnuelle,
  sociétéMère,
  territoireProjet,
  coefficientKChoisi,
  obligationDeSolarisation,
  élémentsSousOmbrière,

  emailContact: Email.bind(emailContact),
  localité: Localité.bind(localité),
  historiqueAbandon: HistoriqueAbandon.bind(historiqueAbandon),
  technologie: TypeTechnologie.bind(technologie),

  actionnariat: bindOptional(TypeActionnariat.bind, actionnariat),
  dateÉchéanceGf: bindOptional(DateTime.bind, dateÉchéanceGf),
  typeGarantiesFinancières: bindOptional(TypeGarantiesFinancières.bind, typeGarantiesFinancières),
  typeInstallationsAgrivoltaiques: bindOptional(
    TypeInstallationsAgrivoltaiques.bind,
    typeInstallationsAgrivoltaiques,
  ),
  typologieDeBâtiment: bindOptional(TypologieBâtiment.bind, typologieDeBâtiment),

  fournisseurs: fournisseurs.map(Fournisseur.bind),

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
      sontÉgaux(valueType.emailContact, this.emailContact) &&
      sontÉgaux(valueType.localité, this.localité) &&
      sontÉgaux(valueType.historiqueAbandon, this.historiqueAbandon) &&
      sontÉgaux(valueType.technologie, this.technologie) &&
      sontÉgaux(valueType.actionnariat, this.actionnariat) &&
      sontÉgaux(valueType.dateÉchéanceGf, this.dateÉchéanceGf) &&
      sontÉgaux(valueType.typeGarantiesFinancières, this.typeGarantiesFinancières) &&
      sontÉgaux(valueType.typologieDeBâtiment, this.typologieDeBâtiment) &&
      sontÉgaux(valueType.typeInstallationsAgrivoltaiques, this.typeInstallationsAgrivoltaiques) &&
      arraySontÉgaux(valueType.fournisseurs, this.fournisseurs)
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

export const convertirEnValueType = ({
  nomCandidat,
  nomProjet,
  nomReprésentantLégal,
  prixReference,
  evaluationCarboneSimplifiée,
  puissanceALaPointe,
  puissanceProductionAnnuelle,
  sociétéMère,
  territoireProjet,
  coefficientKChoisi,
  emailContact,
  localité,
  historiqueAbandon,
  technologie,
  actionnariat,
  dateÉchéanceGf,
  typeGarantiesFinancières,
  typeInstallationsAgrivoltaiques,
  élémentsSousOmbrière,
  typologieDeBâtiment,
  obligationDeSolarisation,
  fournisseurs,
}: WithOptionalUndefined<RawType>) =>
  bind({
    nomCandidat,
    nomProjet,
    nomReprésentantLégal,
    prixReference,
    evaluationCarboneSimplifiée,
    puissanceALaPointe,
    puissanceProductionAnnuelle,
    sociétéMère,
    territoireProjet,
    coefficientKChoisi,
    élémentsSousOmbrière,
    obligationDeSolarisation,
    emailContact: Email.convertirEnValueType(emailContact),
    localité: Localité.bind(localité),
    historiqueAbandon: HistoriqueAbandon.convertirEnValueType(historiqueAbandon),
    technologie: TypeTechnologie.convertirEnValueType(technologie),
    actionnariat: bindOptional(TypeActionnariat.convertirEnValueType, actionnariat),
    dateÉchéanceGf: dateÉchéanceGf ? { date: dateÉchéanceGf } : undefined,
    typeGarantiesFinancières: bindOptional(
      TypeGarantiesFinancières.convertirEnValueType,
      typeGarantiesFinancières,
    ),
    fournisseurs: fournisseurs.map(Fournisseur.convertirEnValueType),
    typeInstallationsAgrivoltaiques: bindOptional(
      TypeInstallationsAgrivoltaiques.convertirEnValueType,
      typeInstallationsAgrivoltaiques,
    ),
    typologieDeBâtiment: bindOptional(TypologieBâtiment.convertirEnValueType, typologieDeBâtiment),
  });

const bindOptional = <TValue, TValueType>(
  bind: (plain: TValue) => TValueType,
  plain: TValue | undefined,
): TValueType | undefined => (plain ? bind(plain) : undefined);

const sontÉgaux = <TValueType extends ReadonlyValueType<unknown>>(
  v1: TValueType | undefined,
  v2: TValueType | undefined,
) => (v1 === undefined ? v2 === undefined : v2 !== undefined && v1.estÉgaleÀ(v2));

const arraySontÉgaux = <TValueType extends ReadonlyValueType<unknown>>(
  v1: TValueType[],
  v2: TValueType[],
) => v1.length === v2.length && !v1.find((v, i) => !v2[i].estÉgaleÀ(v));
