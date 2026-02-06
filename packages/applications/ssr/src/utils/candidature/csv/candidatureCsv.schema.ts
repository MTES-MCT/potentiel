import { z } from 'zod';

import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { conditionalRequiredError, optionalPercentageSchema } from '../schemaBase';
import {
  appelOffreSchema,
  familleSchema,
  numéroCRESchema,
  périodeSchema,
} from '../identifiantProjet.schema';
import { dépôtSchema, numéroDAutorisationDUrbanismeSchema } from '../dépôt.schema';
import { instructionSchema } from '../instruction.schema';

import { mapCsvToTypologieInstallation } from './mapCsvToTypologieInstallation';
import {
  adresse1CsvSchema,
  capacitéDuDispositifDeStockageSchema,
  choixCoefficientKCsvSchema,
  codePostalCsvSchema,
  dateDAutorisationDUrbanismeCsvSchema,
  dateEchéanceGfCsvSchema,
  financementCollectifCsvSchema,
  gouvernancePartagéeCsvSchema,
  historiqueAbandonCsvSchema,
  installationsAgrivoltaïquesCsvSchema,
  natureDeLExploitationCsvSchema,
  notifiedOnCsvSchema,
  obligationDeSolarisationCsvSchema,
  puissanceALaPointeCsvSchema,
  puissanceDuDispositifDeStockageSchema,
  statutCsvSchema,
  technologieCsvSchema,
  typeGarantiesFinancieresCsvSchema,
  typologieDeBâtimentCsvSchema,
  élémentsSousOmbrièreCsvSchema,
  évaluationCarboneSimplifiéeCsvSchema,
  installationAvecDispositifDeStockageCsvSchema,
  territoireProjetSchema,
} from './candidatureCsvFields.schema';
import { getLocalité } from './getLocalité';

// Order matters! the CSV uses "1"/"2"/"3"
const typeGf = [
  Candidature.TypeGarantiesFinancières.sixMoisAprèsAchèvement.type,
  Candidature.TypeGarantiesFinancières.avecDateÉchéance.type,
  Candidature.TypeGarantiesFinancières.consignation.type,
] satisfies Array<Candidature.TypeGarantiesFinancières.RawType>;

const typeNatureDeLExploitationMapper = {
  'Vente avec injection du surplus': 'vente-avec-injection-du-surplus',
  'Vente avec injection en totalité': 'vente-avec-injection-en-totalité',
} satisfies Record<string, Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.RawType>;

const historiqueAbandon = [
  'première-candidature',
  'abandon-classique',
  'abandon-avec-recandidature',
  'lauréat-autre-période',
] satisfies Array<Candidature.HistoriqueAbandon.RawType>;

const technologie = {
  Eolien: 'eolien',
  Hydraulique: 'hydraulique',
  PV: 'pv',
  'N/A': 'N/A',
} satisfies Record<string, Candidature.TypeTechnologie.RawType>;

// Les colonnes du fichier Csv
export const candidatureCsvHeadersMapping = {
  appelOffre: `Appel d'offres`,
  période: 'Période',
  famille: 'Famille',
  numéroCRE: 'N°CRE',
  nomProjet: 'Nom projet',
  sociétéMère: 'Société mère',
  nomCandidat: 'Candidat',
  puissance: 'puissance',
  prixReference: 'prix_reference',
  noteTotale: 'Note totale',
  nomReprésentantLégal: 'Nom et prénom du représentant légal',
  emailContact: 'Adresse électronique du contact',
  adresse1: 'N°, voie, lieu-dit 1',
  adresse2: 'N°, voie, lieu-dit 2',
  codePostal: 'CP',
  commune: 'Commune',
  statut: 'Classé ?',
  motifÉlimination: "Motif d'élimination",
  puissanceALaPointe: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)',
  evaluationCarboneSimplifiée:
    'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
  technologie: 'Technologie\n(dispositif de production)',
  typeGarantiesFinancières:
    "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation",
  financementCollectif: 'Financement collectif (Oui/Non)',
  gouvernancePartagée: 'Gouvernance partagée (Oui/Non)',
  dateÉchéanceGf: "Date d'échéance au format JJ/MM/AAAA",
  historiqueAbandon:
    "1. Lauréat d'aucun AO\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'un AO",
  coefficientKChoisi: 'indexation_k',
  territoireProjet: 'Territoire\n(AO ZNI)', // @TODO : seulement ZNI
  puissanceProjetInitial: 'puissance_projet_initial',
  typeInstallationsAgrivoltaïques: 'Installations agrivoltaïques',
  élémentsSousOmbrière: 'Eléments sous l’ombrière',
  typologieDeBâtiment: 'Typologie de bâtiment',
  obligationDeSolarisation: 'Obligation de solarisation',
  installateur: "Identité de l'installateur",
  installationAvecDispositifDeStockage: 'Installation couplée à un dispositif de stockage',
  puissanceDuDispositifDeStockageEnKW: 'Puissance du dispositif de stockage',
  capacitéDuDispositifDeStockageEnKWh: 'Capacité du dispositif de stockage',
  natureDeLExploitation: "Nature de l'exploitation",
  tauxPrévisionnelACI: "Taux d'autoconsommation individuelle (ACI) prévisionnel",
  dateDAutorisationDUrbanisme: "Date d'obtention de l'autorisation d'urbanisme",
  numéroDAutorisationDUrbanisme: "Numéro de l'autorisation d'urbanisme",
  puissanceDeSite: 'Puissance de site',
} as const;

const candidatureCsvRowSchema = z
  .object({
    notifiedOn: notifiedOnCsvSchema,
    [candidatureCsvHeadersMapping.appelOffre]: appelOffreSchema,
    [candidatureCsvHeadersMapping.période]: périodeSchema,
    [candidatureCsvHeadersMapping.famille]: familleSchema,
    [candidatureCsvHeadersMapping.numéroCRE]: numéroCRESchema,
    [candidatureCsvHeadersMapping.nomProjet]: dépôtSchema.shape.nomProjet,
    [candidatureCsvHeadersMapping.sociétéMère]: dépôtSchema.shape.sociétéMère,
    [candidatureCsvHeadersMapping.nomCandidat]: dépôtSchema.shape.nomCandidat,
    [candidatureCsvHeadersMapping.puissance]: dépôtSchema.shape.puissance,
    [candidatureCsvHeadersMapping.prixReference]: dépôtSchema.shape.prixReference,
    [candidatureCsvHeadersMapping.noteTotale]: instructionSchema.shape.noteTotale,
    [candidatureCsvHeadersMapping.nomReprésentantLégal]: dépôtSchema.shape.nomReprésentantLégal,
    [candidatureCsvHeadersMapping.emailContact]: dépôtSchema.shape.emailContact,
    [candidatureCsvHeadersMapping.adresse1]: adresse1CsvSchema,
    [candidatureCsvHeadersMapping.adresse2]: dépôtSchema.shape.localité.shape.adresse2, // see refine below
    [candidatureCsvHeadersMapping.codePostal]: codePostalCsvSchema,
    [candidatureCsvHeadersMapping.commune]: dépôtSchema.shape.localité.shape.commune,
    [candidatureCsvHeadersMapping.statut]: statutCsvSchema,
    [candidatureCsvHeadersMapping.puissanceALaPointe]: puissanceALaPointeCsvSchema,
    [candidatureCsvHeadersMapping.evaluationCarboneSimplifiée]:
      évaluationCarboneSimplifiéeCsvSchema,
    [candidatureCsvHeadersMapping.technologie]: technologieCsvSchema,
    [candidatureCsvHeadersMapping.financementCollectif]: financementCollectifCsvSchema,
    [candidatureCsvHeadersMapping.gouvernancePartagée]: gouvernancePartagéeCsvSchema,
    [candidatureCsvHeadersMapping.historiqueAbandon]: historiqueAbandonCsvSchema,
    [candidatureCsvHeadersMapping.coefficientKChoisi]: choixCoefficientKCsvSchema,
    [candidatureCsvHeadersMapping.puissanceDeSite]: dépôtSchema.shape.puissanceDeSite,
    [candidatureCsvHeadersMapping.typeInstallationsAgrivoltaïques]:
      installationsAgrivoltaïquesCsvSchema,
    [candidatureCsvHeadersMapping.élémentsSousOmbrière]: élémentsSousOmbrièreCsvSchema,
    [candidatureCsvHeadersMapping.typologieDeBâtiment]: typologieDeBâtimentCsvSchema,
    [candidatureCsvHeadersMapping.obligationDeSolarisation]: obligationDeSolarisationCsvSchema,
    [candidatureCsvHeadersMapping.dateDAutorisationDUrbanisme]:
      dateDAutorisationDUrbanismeCsvSchema,
    [candidatureCsvHeadersMapping.numéroDAutorisationDUrbanisme]:
      numéroDAutorisationDUrbanismeSchema,
    [candidatureCsvHeadersMapping.installateur]: dépôtSchema.shape.installateur,
    [candidatureCsvHeadersMapping.installationAvecDispositifDeStockage]:
      installationAvecDispositifDeStockageCsvSchema,
    [candidatureCsvHeadersMapping.puissanceDuDispositifDeStockageEnKW]:
      puissanceDuDispositifDeStockageSchema,
    [candidatureCsvHeadersMapping.puissanceProjetInitial]: dépôtSchema.shape.puissanceProjetInitial,
    [candidatureCsvHeadersMapping.capacitéDuDispositifDeStockageEnKWh]:
      capacitéDuDispositifDeStockageSchema,
    [candidatureCsvHeadersMapping.natureDeLExploitation]: natureDeLExploitationCsvSchema,
    [candidatureCsvHeadersMapping.tauxPrévisionnelACI]: optionalPercentageSchema,
    [candidatureCsvHeadersMapping.motifÉlimination]: instructionSchema.shape.motifÉlimination, // see refine below
    [candidatureCsvHeadersMapping.typeGarantiesFinancières]: typeGarantiesFinancieresCsvSchema, // see refine below
    [candidatureCsvHeadersMapping.dateÉchéanceGf]: dateEchéanceGfCsvSchema, // see refine below
    [candidatureCsvHeadersMapping.territoireProjet]: territoireProjetSchema, // see refines below
  })
  // le motif d'élimination est obligatoire si la candidature est éliminée
  .superRefine((obj, ctx) => {
    const actualStatut = obj[candidatureCsvHeadersMapping.statut];
    if (actualStatut === 'éliminé' && !obj[candidatureCsvHeadersMapping.motifÉlimination]) {
      ctx.addIssue(
        conditionalRequiredError(
          candidatureCsvHeadersMapping.motifÉlimination,
          candidatureCsvHeadersMapping.statut,
          actualStatut,
        ),
      );
    }
  })
  // le type de GF est obligatoire si la candidature est classée
  .superRefine((obj, ctx) => {
    const actualStatut = obj[candidatureCsvHeadersMapping.statut];
    const ao = obj[candidatureCsvHeadersMapping.appelOffre];
    const isPPE2 = ao.startsWith('PPE2');
    if (
      isPPE2 &&
      actualStatut === 'classé' &&
      !obj[candidatureCsvHeadersMapping.typeGarantiesFinancières]
    ) {
      ctx.addIssue(
        conditionalRequiredError(
          candidatureCsvHeadersMapping.typeGarantiesFinancières,
          candidatureCsvHeadersMapping.statut,
          actualStatut,
        ),
      );
    }
  })
  // la date d'échéance est obligatoire si les GF sont de type "avec date d'échéance"
  .superRefine((obj, ctx) => {
    const actualStatut = obj[candidatureCsvHeadersMapping.statut];
    if (actualStatut === 'éliminé') return;
    const actualTypeGf = obj[candidatureCsvHeadersMapping.typeGarantiesFinancières]
      ? typeGf[Number(obj[candidatureCsvHeadersMapping.typeGarantiesFinancières]) - 1]
      : undefined;
    if (
      actualTypeGf === 'avec-date-échéance' &&
      !obj[candidatureCsvHeadersMapping.dateÉchéanceGf]
    ) {
      ctx.addIssue(
        conditionalRequiredError(
          candidatureCsvHeadersMapping.dateÉchéanceGf,
          candidatureCsvHeadersMapping.typeGarantiesFinancières,
          '2',
        ),
      );
    }
  })
  // les CRE4 - ZNI nécessitent un territoire projet
  .superRefine((obj, ctx) => {
    const isZNI =
      obj[candidatureCsvHeadersMapping.appelOffre] === 'CRE4 - ZNI' ||
      obj[candidatureCsvHeadersMapping.appelOffre] === 'CRE4 - ZNI 2017';
    if (isZNI && !obj[candidatureCsvHeadersMapping.territoireProjet]) {
      ctx.addIssue(
        conditionalRequiredError(
          candidatureCsvHeadersMapping.territoireProjet,
          candidatureCsvHeadersMapping.appelOffre,
          'CRE4 - ZNI',
        ),
      );
    }
  })
  // on ne peut pas avoir financement collectif et gouvernance partagée
  .refine(
    (val) =>
      !(
        val[candidatureCsvHeadersMapping.financementCollectif] &&
        val[candidatureCsvHeadersMapping.gouvernancePartagée]
      ),
    {
      message: `Seule l'une des deux colonnes "${candidatureCsvHeadersMapping.financementCollectif}" et "${candidatureCsvHeadersMapping.gouvernancePartagée}" peut avoir la valeur "Oui"`,
      path: [
        candidatureCsvHeadersMapping.financementCollectif,
        candidatureCsvHeadersMapping.gouvernancePartagée,
      ],
    },
  )
  // on doit avoir au minimum adresse1 ou adresse2
  .refine(
    (val) =>
      !!val[candidatureCsvHeadersMapping.adresse1] || !!val[candidatureCsvHeadersMapping.adresse2],
    {
      message: `L'une des deux colonnes "${candidatureCsvHeadersMapping.adresse1}" et "${candidatureCsvHeadersMapping.adresse2}" doit être renseignée`,
      path: [candidatureCsvHeadersMapping.adresse1, candidatureCsvHeadersMapping.adresse2],
    },
  )
  // si l'installation est couplée à un dispositif de stockage, on doit en avoir la capacité et la puissance
  .refine(
    (val) =>
      (val[candidatureCsvHeadersMapping.installationAvecDispositifDeStockage] &&
        val[candidatureCsvHeadersMapping.capacitéDuDispositifDeStockageEnKWh] !== undefined &&
        val[candidatureCsvHeadersMapping.puissanceDuDispositifDeStockageEnKW] !== undefined) ||
      !val[candidatureCsvHeadersMapping.installationAvecDispositifDeStockage],
    {
      message: 'La capacité et la puissance du dispositif de stockage sont requises',
      path: [
        candidatureCsvHeadersMapping.capacitéDuDispositifDeStockageEnKWh,
        candidatureCsvHeadersMapping.puissanceDuDispositifDeStockageEnKW,
      ],
    },
  );

export const candidatureCsvSchema = candidatureCsvRowSchema
  // Transforme les noms des clés de la ligne en valeurs plus simples à manipuler
  .transform((val) => {
    type CandidatureShape = {
      [P in keyof typeof candidatureCsvHeadersMapping]: (typeof val)[(typeof candidatureCsvHeadersMapping)[P]];
    };
    return (
      Object.keys(candidatureCsvHeadersMapping) as (keyof typeof candidatureCsvHeadersMapping)[]
    ).reduce(
      (prev, curr) => ({ ...prev, [curr]: val[candidatureCsvHeadersMapping[curr]] }),
      {} as unknown as CandidatureShape,
    );
  })
  // Transforme les valeurs en index ("1,2,3") en des valeurs plus claires ("avec-date-échéance")
  .transform(
    ({
      financementCollectif,
      gouvernancePartagée,
      numéroDAutorisationDUrbanisme,
      dateDAutorisationDUrbanisme,
      typologieDeBâtiment,
      typeInstallationsAgrivoltaïques,
      élémentsSousOmbrière,
      codePostal,
      adresse1,
      adresse2,
      commune,
      typeGarantiesFinancières,
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKWh,
      puissanceDuDispositifDeStockageEnKW,
      tauxPrévisionnelACI,
      natureDeLExploitation,
      ...val
    }) => {
      return {
        ...val,
        localité: getLocalité({
          adresse1,
          adresse2: adresse2 ?? '',
          codePostal,
          commune,
        }),
        typeGarantiesFinancières: typeGarantiesFinancières
          ? typeGf[Number(typeGarantiesFinancières) - 1]
          : undefined,
        historiqueAbandon: historiqueAbandon[Number(val.historiqueAbandon) - 1],
        technologie: technologie[val.technologie],
        dateÉchéanceGf: val.dateÉchéanceGf,
        actionnariat: financementCollectif
          ? Candidature.TypeActionnariat.financementCollectif.formatter()
          : gouvernancePartagée
            ? Candidature.TypeActionnariat.gouvernancePartagée.formatter()
            : undefined,
        autorisationDUrbanisme:
          dateDAutorisationDUrbanisme && numéroDAutorisationDUrbanisme
            ? {
                date: dateDAutorisationDUrbanisme,
                numéro: numéroDAutorisationDUrbanisme,
              }
            : undefined,
        natureDeLExploitation:
          natureDeLExploitation && typeNatureDeLExploitationMapper[natureDeLExploitation]
            ? {
                typeNatureDeLExploitation: typeNatureDeLExploitationMapper[natureDeLExploitation],
                tauxPrévisionnelACI,
              }
            : undefined,
        typologieInstallation: mapCsvToTypologieInstallation({
          typologieDeBâtiment,
          typeInstallationsAgrivoltaïques,
          élémentsSousOmbrière,
        }),
        dispositifDeStockage:
          installationAvecDispositifDeStockage !== undefined
            ? {
                installationAvecDispositifDeStockage,
                capacitéDuDispositifDeStockageEnKWh,
                puissanceDuDispositifDeStockageEnKW,
              }
            : undefined,
      };
    },
  );

export type CandidatureCsvRowShape = z.infer<typeof candidatureCsvRowSchema>;
export type CandidatureShape = z.infer<typeof candidatureCsvSchema>;
