import { mapToPlainObject, PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { Fournisseur } from '../lauréat/fournisseur';
import { GarantiesFinancières } from '../lauréat';

import {
  HistoriqueAbandon,
  Localité,
  TypeActionnariat,
  TypeDeNatureDeLExploitation,
  TypeGarantiesFinancières,
  TypeTechnologie,
  TypologieInstallation,
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
  dateDélibérationGf: DateTime.RawType | undefined;
  territoireProjet: string;
  fournisseurs: Array<Fournisseur.RawType>;
  typologieInstallation: Array<TypologieInstallation.RawType>;
  obligationDeSolarisation: boolean | undefined;
  puissanceDeSite: number | undefined;
  autorisationDUrbanisme: { numéro: string; date: DateTime.RawType } | undefined;
  installateur: string | undefined;
  installationAvecDispositifDeStockage: boolean | undefined;
  natureDeLExploitation: TypeDeNatureDeLExploitation.RawType | undefined;
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
  garantiesFinancières?: GarantiesFinancières.GarantiesFinancières.ValueType;
  territoireProjet: string;
  fournisseurs: Array<Fournisseur.ValueType>;
  typologieInstallation: Array<TypologieInstallation.ValueType>;
  obligationDeSolarisation: boolean | undefined;
  puissanceDeSite: number | undefined;
  autorisationDUrbanisme: { numéro: string; date: DateTime.ValueType } | undefined;
  installateur: string | undefined;
  installationAvecDispositifDeStockage: boolean | undefined;
  natureDeLExploitation: TypeDeNatureDeLExploitation.ValueType | undefined;

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

  emailContact: Email.bind(plain.emailContact),
  localité: Localité.bind(plain.localité),
  historiqueAbandon: HistoriqueAbandon.bind(plain.historiqueAbandon),
  technologie: TypeTechnologie.bind(plain.technologie),

  actionnariat: bindOptional(TypeActionnariat.bind, plain.actionnariat),
  garantiesFinancières: plain.garantiesFinancières
    ? GarantiesFinancières.GarantiesFinancières.bind(plain.garantiesFinancières)
    : undefined,

  fournisseurs: plain.fournisseurs.map(Fournisseur.bind),
  puissanceDeSite: plain.puissanceDeSite,
  autorisationDUrbanisme: plain.autorisationDUrbanisme
    ? {
        date: DateTime.bind(plain.autorisationDUrbanisme.date),
        numéro: plain.autorisationDUrbanisme.numéro,
      }
    : undefined,
  typologieInstallation: plain.typologieInstallation.map(TypologieInstallation.bind),
  installateur: plain.installateur,
  installationAvecDispositifDeStockage: plain.installationAvecDispositifDeStockage,
  natureDeLExploitation: bindOptional(
    TypeDeNatureDeLExploitation.bind,
    plain.natureDeLExploitation,
  ),

  estÉgaleÀ(valueType) {
    return (
      valueType.nomProjet === this.nomProjet &&
      valueType.nomCandidat === this.nomCandidat &&
      valueType.nomReprésentantLégal === this.nomReprésentantLégal &&
      valueType.prixReference === this.prixReference &&
      valueType.evaluationCarboneSimplifiée === this.evaluationCarboneSimplifiée &&
      valueType.puissanceALaPointe === this.puissanceALaPointe &&
      valueType.coefficientKChoisi === this.coefficientKChoisi &&
      valueType.puissanceDeSite === this.puissanceDeSite &&
      valueType.puissanceProductionAnnuelle === this.puissanceProductionAnnuelle &&
      valueType.sociétéMère === this.sociétéMère &&
      valueType.territoireProjet === this.territoireProjet &&
      valueType.obligationDeSolarisation === this.obligationDeSolarisation &&
      valueType.autorisationDUrbanisme?.numéro === this.autorisationDUrbanisme?.numéro &&
      valueType.installateur === this.installateur &&
      valueType.installationAvecDispositifDeStockage ===
        this.installationAvecDispositifDeStockage &&
      areEqual(valueType.autorisationDUrbanisme?.date, this.autorisationDUrbanisme?.date) &&
      areEqual(valueType.emailContact, this.emailContact) &&
      areEqual(valueType.localité, this.localité) &&
      areEqual(valueType.historiqueAbandon, this.historiqueAbandon) &&
      areEqual(valueType.technologie, this.technologie) &&
      areEqual(valueType.actionnariat, this.actionnariat) &&
      areEqual(valueType.garantiesFinancières, this.garantiesFinancières) &&
      areEqualArrays(valueType.fournisseurs, this.fournisseurs) &&
      areEqualArrays(valueType.typologieInstallation, this.typologieInstallation) &&
      areEqual(valueType.natureDeLExploitation, this.natureDeLExploitation)
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
      puissanceDeSite: this.puissanceDeSite,
      obligationDeSolarisation: this.obligationDeSolarisation,
      emailContact: this.emailContact.formatter(),
      localité: this.localité.formatter(),
      historiqueAbandon: this.historiqueAbandon.formatter(),
      technologie: this.technologie.formatter(),
      actionnariat: this.actionnariat?.formatter(),
      dateÉchéanceGf: this.garantiesFinancières?.estAvecDateÉchéance()
        ? this.garantiesFinancières.dateÉchéance.formatter()
        : undefined,
      dateDélibérationGf: this.garantiesFinancières?.estExemption()
        ? this.garantiesFinancières.dateDélibération.formatter()
        : undefined,
      typeGarantiesFinancières: this.garantiesFinancières?.type.formatter(),
      fournisseurs: this.fournisseurs.map((fournisseur) => fournisseur.formatter()),
      typologieInstallation: this.typologieInstallation.map((typologieInstallation) =>
        typologieInstallation.formatter(),
      ),
      autorisationDUrbanisme: this.autorisationDUrbanisme
        ? {
            date: this.autorisationDUrbanisme.date.formatter(),
            numéro: this.autorisationDUrbanisme.numéro,
          }
        : undefined,
      installateur: this.installateur,
      installationAvecDispositifDeStockage: this.installationAvecDispositifDeStockage,
      natureDeLExploitation: this.natureDeLExploitation?.formatter(),
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
    obligationDeSolarisation: raw.obligationDeSolarisation,
    emailContact: Email.convertirEnValueType(raw.emailContact),
    localité: Localité.bind(raw.localité),
    historiqueAbandon: HistoriqueAbandon.convertirEnValueType(raw.historiqueAbandon),
    technologie: TypeTechnologie.convertirEnValueType(raw.technologie),
    actionnariat: bindOptional(TypeActionnariat.convertirEnValueType, raw.actionnariat),
    garantiesFinancières: raw.typeGarantiesFinancières
      ? mapToPlainObject(
          GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
            type: raw.typeGarantiesFinancières,
            dateDélibération: raw.dateDélibérationGf,
            dateÉchéance: raw.dateÉchéanceGf,
          }),
        )
      : undefined,
    fournisseurs: raw.fournisseurs.map(Fournisseur.convertirEnValueType),
    typologieInstallation: raw.typologieInstallation.map(
      TypologieInstallation.convertirEnValueType,
    ),
    puissanceDeSite: raw.puissanceDeSite,
    autorisationDUrbanisme:
      raw.autorisationDUrbanisme?.date && raw.autorisationDUrbanisme.numéro
        ? mapToPlainObject({
            date: DateTime.convertirEnValueType(raw.autorisationDUrbanisme.date),
            numéro: raw.autorisationDUrbanisme.numéro,
          })
        : undefined,
    installateur: raw.installateur,
    installationAvecDispositifDeStockage: raw.installationAvecDispositifDeStockage,
    natureDeLExploitation: bindOptional(
      TypeDeNatureDeLExploitation.convertirEnValueType,
      raw.natureDeLExploitation,
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
