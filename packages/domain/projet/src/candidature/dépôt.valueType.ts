import { mapToPlainObject, PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { Fournisseur } from '../lauréat/fournisseur/index.js';
import { GarantiesFinancières } from '../lauréat/index.js';
import { Lauréat } from '../index.js';
import { TypeDeNatureDeLExploitation } from '../lauréat/nature-de-l-exploitation/index.js';

import {
  HistoriqueAbandon,
  Localité,
  TypeActionnariat,
  TypeGarantiesFinancières,
  TypeTechnologie,
  TypologieInstallation,
} from './index.js';

export type RawType = {
  nomProjet: string;
  nomCandidat: string;
  emailContact: Email.RawType;
  sociétéMère: string;
  nomReprésentantLégal: string;
  prixReference: number;
  localité: Localité.RawType;
  historiqueAbandon: HistoriqueAbandon.RawType;
  puissance: number;
  puissanceALaPointe: boolean;
  puissanceDeSite: number | undefined;
  puissanceProjetInitial: number | undefined;
  coefficientKChoisi: boolean | undefined;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.RawType;
  actionnariat: TypeActionnariat.RawType | undefined;
  typeGarantiesFinancières: TypeGarantiesFinancières.RawType | undefined;
  dateÉchéanceGf: DateTime.RawType | undefined;
  attestationConstitutionGf: { format: string } | undefined;
  dateConstitutionGf: DateTime.RawType | undefined;
  territoireProjet: string;
  fournisseurs: Array<Fournisseur.RawType>;
  typologieInstallation: Array<TypologieInstallation.RawType>;
  obligationDeSolarisation: boolean | undefined;
  autorisation: { numéro: string; date: DateTime.RawType } | undefined;
  installateur: string | undefined;
  dispositifDeStockage: Lauréat.Installation.DispositifDeStockage.RawType | undefined;
  natureDeLExploitation:
    | {
        typeNatureDeLExploitation: TypeDeNatureDeLExploitation.RawType;
        tauxPrévisionnelACI?: number;
        tauxPrévisionnelACC?: number;
      }
    | undefined;
};

export type ValueType = ReadonlyValueType<{
  nomProjet: string;
  nomCandidat: string;
  emailContact: Email.ValueType;
  sociétéMère: string;
  nomReprésentantLégal: string;
  prixReference: number;
  localité: Localité.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  puissance: number;
  puissanceALaPointe: boolean;
  puissanceDeSite: number | undefined;
  puissanceProjetInitial: number | undefined;
  coefficientKChoisi: boolean | undefined;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.ValueType;
  actionnariat: TypeActionnariat.ValueType | undefined;
  garantiesFinancières?: GarantiesFinancières.GarantiesFinancières.ValueType;
  territoireProjet: string;
  fournisseurs: Array<Fournisseur.ValueType>;
  typologieInstallation: Array<TypologieInstallation.ValueType>;
  obligationDeSolarisation: boolean | undefined;
  autorisation: { numéro: string; date: DateTime.ValueType } | undefined;
  installateur: string | undefined;
  dispositifDeStockage: Lauréat.Installation.DispositifDeStockage.ValueType | undefined;
  natureDeLExploitation:
    | {
        typeNatureDeLExploitation: TypeDeNatureDeLExploitation.ValueType;
        tauxPrévisionnelACI?: number;
        tauxPrévisionnelACC?: number;
      }
    | undefined;

  formatter(): RawType;
}>;

export const bind = (plain: PlainType<ValueType>): ValueType => ({
  nomProjet: plain.nomProjet,
  nomCandidat: plain.nomCandidat,
  nomReprésentantLégal: plain.nomReprésentantLégal,
  prixReference: plain.prixReference,
  evaluationCarboneSimplifiée: plain.evaluationCarboneSimplifiée,
  puissanceALaPointe: plain.puissanceALaPointe,
  puissance: plain.puissance,
  puissanceProjetInitial: plain.puissanceProjetInitial,
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
  autorisation: plain.autorisation
    ? {
        date: DateTime.bind(plain.autorisation.date),
        numéro: plain.autorisation.numéro,
      }
    : undefined,
  typologieInstallation: plain.typologieInstallation.map(TypologieInstallation.bind),
  installateur: plain.installateur,
  dispositifDeStockage: bindOptional(
    Lauréat.Installation.DispositifDeStockage.bind,
    plain.dispositifDeStockage,
  ),
  natureDeLExploitation: plain.natureDeLExploitation
    ? {
        typeNatureDeLExploitation: Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.bind(
          plain.natureDeLExploitation.typeNatureDeLExploitation,
        ),
        tauxPrévisionnelACI: plain.natureDeLExploitation.tauxPrévisionnelACI,
        tauxPrévisionnelACC: plain.natureDeLExploitation.tauxPrévisionnelACC,
      }
    : undefined,

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
      valueType.puissance === this.puissance &&
      valueType.puissanceProjetInitial === this.puissanceProjetInitial &&
      valueType.sociétéMère === this.sociétéMère &&
      valueType.territoireProjet === this.territoireProjet &&
      valueType.obligationDeSolarisation === this.obligationDeSolarisation &&
      valueType.autorisation?.numéro === this.autorisation?.numéro &&
      valueType.installateur === this.installateur &&
      areEqual(valueType.dispositifDeStockage, this.dispositifDeStockage) &&
      valueType.natureDeLExploitation?.tauxPrévisionnelACI ===
        this.natureDeLExploitation?.tauxPrévisionnelACI &&
      valueType.natureDeLExploitation?.tauxPrévisionnelACC ===
        this.natureDeLExploitation?.tauxPrévisionnelACC &&
      areEqual(valueType.autorisation?.date, this.autorisation?.date) &&
      areEqual(valueType.emailContact, this.emailContact) &&
      areEqual(valueType.localité, this.localité) &&
      areEqual(valueType.historiqueAbandon, this.historiqueAbandon) &&
      areEqual(valueType.technologie, this.technologie) &&
      areEqual(valueType.actionnariat, this.actionnariat) &&
      areEqual(valueType.garantiesFinancières, this.garantiesFinancières) &&
      areEqualArrays(valueType.fournisseurs, this.fournisseurs) &&
      areEqualArrays(valueType.typologieInstallation, this.typologieInstallation) &&
      areEqual(
        valueType.natureDeLExploitation?.typeNatureDeLExploitation,
        this.natureDeLExploitation?.typeNatureDeLExploitation,
      )
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
      puissance: this.puissance,
      puissanceProjetInitial: this.puissanceProjetInitial,
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
      typeGarantiesFinancières: this.garantiesFinancières?.type.formatter(),
      dateÉchéanceGf: this.garantiesFinancières?.estAvecDateÉchéance()
        ? this.garantiesFinancières.dateÉchéance.formatter()
        : undefined,
      attestationConstitutionGf: this.garantiesFinancières?.constitution
        ? { format: this.garantiesFinancières.constitution.attestation.format }
        : undefined,
      dateConstitutionGf: this.garantiesFinancières?.constitution?.date.formatter(),
      fournisseurs: this.fournisseurs.map((fournisseur) => fournisseur.formatter()),
      typologieInstallation: this.typologieInstallation.map((typologieInstallation) =>
        typologieInstallation.formatter(),
      ),
      autorisation: this.autorisation
        ? {
            date: this.autorisation.date.formatter(),
            numéro: this.autorisation.numéro,
          }
        : undefined,
      installateur: this.installateur,
      dispositifDeStockage: this.dispositifDeStockage?.formatter(),
      natureDeLExploitation: this.natureDeLExploitation
        ? {
            typeNatureDeLExploitation:
              this.natureDeLExploitation.typeNatureDeLExploitation.formatter(),
            tauxPrévisionnelACI: this.natureDeLExploitation.tauxPrévisionnelACI,
            tauxPrévisionnelACC: this.natureDeLExploitation.tauxPrévisionnelACC,
          }
        : undefined,
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
    puissance: raw.puissance,
    puissanceProjetInitial: raw.puissanceProjetInitial,
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
            dateÉchéance: raw.dateÉchéanceGf,
            constitution:
              raw.attestationConstitutionGf && raw.dateConstitutionGf
                ? {
                    attestation: raw.attestationConstitutionGf,
                    date: raw.dateConstitutionGf,
                  }
                : undefined,
          }),
        )
      : undefined,
    fournisseurs: raw.fournisseurs.map(Fournisseur.convertirEnValueType),
    typologieInstallation: raw.typologieInstallation.map(
      TypologieInstallation.convertirEnValueType,
    ),
    puissanceDeSite: raw.puissanceDeSite,
    autorisation:
      raw.autorisation?.date && raw.autorisation.numéro
        ? mapToPlainObject({
            date: DateTime.convertirEnValueType(raw.autorisation.date),
            numéro: raw.autorisation.numéro,
          })
        : undefined,
    installateur: raw.installateur,

    dispositifDeStockage: bindOptional(
      Lauréat.Installation.DispositifDeStockage.convertirEnValueType,
      raw.dispositifDeStockage,
    ),
    natureDeLExploitation: raw.natureDeLExploitation
      ? mapToPlainObject({
          typeNatureDeLExploitation:
            Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.convertirEnValueType(
              raw.natureDeLExploitation.typeNatureDeLExploitation,
            ),
          tauxPrévisionnelACI: raw.natureDeLExploitation.tauxPrévisionnelACI,
          tauxPrévisionnelACC: raw.natureDeLExploitation.tauxPrévisionnelACC,
        })
      : undefined,
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
