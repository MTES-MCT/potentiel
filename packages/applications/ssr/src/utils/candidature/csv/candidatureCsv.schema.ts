import { z } from 'zod';

import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { conditionalRequiredError } from '../schemaBase';
import {
  adresse2Schema,
  appelOffreSchema,
  communeSchema,
  emailContactSchema,
  familleSchema,
  nomCandidatSchema,
  nomProjetSchema,
  nomReprésentantLégalSchema,
  noteTotaleSchema,
  numéroCRESchema,
  prixRéférenceSchema,
  puissanceProductionAnnuelleSchema,
  périodeSchema,
  sociétéMèreSchema,
  motifEliminationSchema,
  territoireProjetSchema,
  puissanceDeSiteSchema,
  numéroDAutorisationDUrbanismeSchema,
  installateurSchema,
} from '../candidatureFields.schema';

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
} from './candidatureCsvFields.schema';
import { getLocalité } from './getLocalité';

// Order matters! the CSV uses "1"/"2"/"3"
const typeGf = [
  Candidature.TypeGarantiesFinancières.sixMoisAprèsAchèvement.type,
  Candidature.TypeGarantiesFinancières.avecDateÉchéance.type,
  Candidature.TypeGarantiesFinancières.consignation.type,
] satisfies Array<Candidature.TypeGarantiesFinancières.RawType>;

// Order matters! the CSV uses "1"/"2"
const typesNatureDeLExploitation = [
  Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.venteAvecInjectionEnSurplus.type,
  Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.venteAvecInjectionEnTotalité.type,
] satisfies Array<Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.RawType>;

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
const colonnes = {
  appelOffre: `Appel d'offres`,
  période: 'Période',
  famille: 'Famille',
  numéroCRE: 'N°CRE',
  nomProjet: 'Nom projet',
  sociétéMère: 'Société mère',
  nomCandidat: 'Candidat',
  puissanceProductionAnnuelle: 'puissance_production_annuelle',
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
  territoireProjet: 'Territoire\n(AO ZNI)',
  coefficientKChoisi: 'indexation_k',
  typeInstallationsAgrivoltaïques: 'Installations agrivoltaïques',
  élémentsSousOmbrière: 'Eléments sous l’ombrière',
  typologieDeBâtiment: 'Typologie de bâtiment',
  obligationDeSolarisation: 'Obligation de solarisation',
  puissanceDeSite: 'Puissance de site',
  dateDAutorisationDUrbanisme: "Date d'obtention de l'autorisation d'urbanisme",
  numéroDAutorisationDUrbanisme: "Numéro de l'autorisation d'urbanisme",
  installateur: "Identité de l'installateur",
  installationAvecDispositifDeStockage: 'Installation couplée à un dispositif de stockage',
  puissanceDuDispositifDeStockageEnKW: 'Puissance du dispositif de stockage',
  capacitéDuDispositifDeStockageEnKWh: 'Capacité du dispositif de stockage',
  natureDeLExploitation: "Nature de l'exploitation",
} as const;

const candidatureCsvRowSchema = z
  .object({
    notifiedOn: notifiedOnCsvSchema,
    [colonnes.appelOffre]: appelOffreSchema,
    [colonnes.période]: périodeSchema,
    [colonnes.famille]: familleSchema,
    [colonnes.numéroCRE]: numéroCRESchema,
    [colonnes.nomProjet]: nomProjetSchema,
    [colonnes.sociétéMère]: sociétéMèreSchema,
    [colonnes.nomCandidat]: nomCandidatSchema,
    [colonnes.puissanceProductionAnnuelle]: puissanceProductionAnnuelleSchema,
    [colonnes.prixReference]: prixRéférenceSchema,
    [colonnes.noteTotale]: noteTotaleSchema,
    [colonnes.nomReprésentantLégal]: nomReprésentantLégalSchema,
    [colonnes.emailContact]: emailContactSchema,
    [colonnes.adresse1]: adresse1CsvSchema,
    [colonnes.adresse2]: adresse2Schema, // see refine below
    [colonnes.codePostal]: codePostalCsvSchema,
    [colonnes.commune]: communeSchema,
    [colonnes.statut]: statutCsvSchema,
    [colonnes.puissanceALaPointe]: puissanceALaPointeCsvSchema,
    [colonnes.evaluationCarboneSimplifiée]: évaluationCarboneSimplifiéeCsvSchema,
    [colonnes.technologie]: technologieCsvSchema,
    [colonnes.financementCollectif]: financementCollectifCsvSchema,
    [colonnes.gouvernancePartagée]: gouvernancePartagéeCsvSchema,
    [colonnes.historiqueAbandon]: historiqueAbandonCsvSchema,
    [colonnes.coefficientKChoisi]: choixCoefficientKCsvSchema,
    [colonnes.puissanceDeSite]: puissanceDeSiteSchema,
    [colonnes.typeInstallationsAgrivoltaïques]: installationsAgrivoltaïquesCsvSchema,
    [colonnes.élémentsSousOmbrière]: élémentsSousOmbrièreCsvSchema,
    [colonnes.typologieDeBâtiment]: typologieDeBâtimentCsvSchema,
    [colonnes.obligationDeSolarisation]: obligationDeSolarisationCsvSchema,
    [colonnes.dateDAutorisationDUrbanisme]: dateDAutorisationDUrbanismeCsvSchema,
    [colonnes.numéroDAutorisationDUrbanisme]: numéroDAutorisationDUrbanismeSchema,
    [colonnes.installateur]: installateurSchema,
    [colonnes.installationAvecDispositifDeStockage]: installationAvecDispositifDeStockageCsvSchema,
    [colonnes.puissanceDuDispositifDeStockageEnKW]: puissanceDuDispositifDeStockageSchema,
    [colonnes.capacitéDuDispositifDeStockageEnKWh]: capacitéDuDispositifDeStockageSchema,
    // columns with refines, see refines below
    [colonnes.motifÉlimination]: motifEliminationSchema, // see refine below
    [colonnes.typeGarantiesFinancières]: typeGarantiesFinancieresCsvSchema, // see refine below
    [colonnes.dateÉchéanceGf]: dateEchéanceGfCsvSchema, // see refine below
    [colonnes.territoireProjet]: territoireProjetSchema, // see refines below
    [colonnes.natureDeLExploitation]: natureDeLExploitationCsvSchema,
  })
  // le motif d'élimination est obligatoire si la candidature est éliminée
  .superRefine((obj, ctx) => {
    const actualStatut = obj[colonnes.statut];
    if (actualStatut === 'éliminé' && !obj[colonnes.motifÉlimination]) {
      ctx.addIssue(
        conditionalRequiredError(colonnes.motifÉlimination, colonnes.statut, actualStatut),
      );
    }
  })
  // le type de GF est obligatoire si la candidature est classée
  .superRefine((obj, ctx) => {
    const actualStatut = obj[colonnes.statut];
    const ao = obj[colonnes.appelOffre];
    const isPPE2 = ao.startsWith('PPE2');
    if (isPPE2 && actualStatut === 'classé' && !obj[colonnes.typeGarantiesFinancières]) {
      ctx.addIssue(
        conditionalRequiredError(colonnes.typeGarantiesFinancières, colonnes.statut, actualStatut),
      );
    }
  })
  // la date d'échéance est obligatoire si les GF sont de type "avec date d'échéance"
  .superRefine((obj, ctx) => {
    const actualStatut = obj[colonnes.statut];
    if (actualStatut === 'éliminé') return;
    const actualTypeGf = obj[colonnes.typeGarantiesFinancières]
      ? typeGf[Number(obj[colonnes.typeGarantiesFinancières]) - 1]
      : undefined;
    if (actualTypeGf === 'avec-date-échéance' && !obj[colonnes.dateÉchéanceGf]) {
      ctx.addIssue(
        conditionalRequiredError(colonnes.dateÉchéanceGf, colonnes.typeGarantiesFinancières, '2'),
      );
    }
  })
  // les CRE4 - ZNI nécessitent un territoire projet
  .superRefine((obj, ctx) => {
    const isZNI =
      obj[colonnes.appelOffre] === 'CRE4 - ZNI' || obj[colonnes.appelOffre] === 'CRE4 - ZNI 2017';
    if (isZNI && !obj[colonnes.territoireProjet]) {
      ctx.addIssue(
        conditionalRequiredError(colonnes.territoireProjet, colonnes.appelOffre, 'CRE4 - ZNI'),
      );
    }
  })
  // on ne peut pas avoir financement collectif et gouvernance partagée
  .refine((val) => !(val[colonnes.financementCollectif] && val[colonnes.gouvernancePartagée]), {
    message: `Seule l'une des deux colonnes "${colonnes.financementCollectif}" et "${colonnes.gouvernancePartagée}" peut avoir la valeur "Oui"`,
    path: [colonnes.financementCollectif, colonnes.gouvernancePartagée],
  })
  // on doit avoir au minimum adresse1 ou adresse2
  .refine((val) => !!val[colonnes.adresse1] || !!val[colonnes.adresse2], {
    message: `L'une des deux colonnes "${colonnes.adresse1}" et "${colonnes.adresse2}" doit être renseignée`,
    path: [colonnes.adresse1, colonnes.adresse2],
  })
  // si l'installation est couplée à un dispositif de stockage, on doit en avoir la capacité et la puissance
  .refine(
    (val) =>
      (val[colonnes.installationAvecDispositifDeStockage] &&
        val[colonnes.capacitéDuDispositifDeStockageEnKWh] !== undefined &&
        val[colonnes.puissanceDuDispositifDeStockageEnKW] !== undefined) ||
      !val[colonnes.installationAvecDispositifDeStockage],
    {
      message: 'La capacité et la puissance du dispositif de stockage sont requis',
      path: [
        colonnes.capacitéDuDispositifDeStockageEnKWh,
        colonnes.puissanceDuDispositifDeStockageEnKW,
      ],
    },
  );

export const candidatureCsvSchema = candidatureCsvRowSchema
  // Transforme les noms des clés de la ligne en valeurs plus simples à manipuler
  .transform((val) => {
    type CandidatureShape = {
      [P in keyof typeof colonnes]: (typeof val)[(typeof colonnes)[P]];
    };
    return (Object.keys(colonnes) as (keyof typeof colonnes)[]).reduce(
      (prev, curr) => ({ ...prev, [curr]: val[colonnes[curr]] }),
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
      natureDeLExploitation,
      typeGarantiesFinancières,
      installationAvecDispositifDeStockage,
      capacitéDuDispositifDeStockageEnKWh,
      puissanceDuDispositifDeStockageEnKW,
      ...val
    }) => {
      return {
        ...val,
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
        natureDeLExploitation: natureDeLExploitation
          ? typesNatureDeLExploitation[Number(natureDeLExploitation) - 1]
          : undefined,
        typologieInstallation: mapCsvToTypologieInstallation({
          typologieDeBâtiment,
          typeInstallationsAgrivoltaïques,
          élémentsSousOmbrière,
        }),
        localité: getLocalité({
          adresse1,
          adresse2: adresse2 ?? '',
          codePostal,
          commune,
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
