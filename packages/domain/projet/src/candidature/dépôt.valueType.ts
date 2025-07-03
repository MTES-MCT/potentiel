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
  prixRéférence: number;
  localité: Localité.RawType;
  historiqueAbandon: HistoriqueAbandon.RawType;
  puissanceÀLaPointe: boolean;
  coefficientKChoisi: boolean | undefined;
  évaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.RawType;
  typeActionnariat: TypeActionnariat.RawType | undefined;
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
  prixRéférence: number;
  localité: Localité.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  puissanceÀLaPointe: boolean;
  coefficientKChoisi: boolean | undefined;
  évaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.ValueType;
  typeActionnariat: TypeActionnariat.ValueType | undefined;
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
  prixRéférence,
  localité,
  historiqueAbandon,
  puissanceÀLaPointe,
  coefficientKChoisi,
  évaluationCarboneSimplifiée,
  technologie,
  typeActionnariat,
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
  prixRéférence,
  évaluationCarboneSimplifiée,
  puissanceÀLaPointe,
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

  typeActionnariat: bindOptional(TypeActionnariat.bind, typeActionnariat),
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
      valueType.prixRéférence === this.prixRéférence &&
      valueType.évaluationCarboneSimplifiée === this.évaluationCarboneSimplifiée &&
      valueType.puissanceÀLaPointe === this.puissanceÀLaPointe &&
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
      sontÉgaux(valueType.typeActionnariat, this.typeActionnariat) &&
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
      prixRéférence: this.prixRéférence,
      évaluationCarboneSimplifiée: this.évaluationCarboneSimplifiée,
      puissanceÀLaPointe: this.puissanceÀLaPointe,
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
      typeActionnariat: this.typeActionnariat?.formatter(),
      dateÉchéanceGf: this.dateÉchéanceGf?.formatter(),
      typeGarantiesFinancières: this.typeGarantiesFinancières?.formatter(),
      fournisseurs: this.fournisseurs.map((fournisseur) => fournisseur.formatter()),
      typeInstallationsAgrivoltaiques: this.typeInstallationsAgrivoltaiques?.formatter(),
      typologieDeBâtiment: this.typologieDeBâtiment?.formatter(),
    };
  },
});

export const convertirEnValueType = ({
  nomCandidat,
  nomProjet,
  nomReprésentantLégal,
  prixRéférence,
  évaluationCarboneSimplifiée,
  puissanceÀLaPointe,
  puissanceProductionAnnuelle,
  sociétéMère,
  territoireProjet,
  coefficientKChoisi,
  emailContact,
  localité,
  historiqueAbandon,
  technologie,
  typeActionnariat,
  dateÉchéanceGf,
  typeGarantiesFinancières,
  typeInstallationsAgrivoltaiques,
  élémentsSousOmbrière,
  typologieDeBâtiment,
  obligationDeSolarisation,
  fournisseurs,
}: RawType) =>
  bind({
    nomCandidat,
    nomProjet,
    nomReprésentantLégal,
    prixRéférence,
    évaluationCarboneSimplifiée,
    puissanceÀLaPointe,
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
    typeActionnariat: bindOptional(TypeActionnariat.convertirEnValueType, typeActionnariat),
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
