import { z } from 'zod'
import moment from 'moment-timezone'
import getDepartementRegionFromCodePostal from '../../../helpers/getDepartementRegionFromCodePostal'
import toNumber from '../../../helpers/toNumber'
moment.tz.setDefault('Europe/Paris')

const appelOffreId = (line: any) => line["Appel d'offres"]

const mappedColumns = [
  "Appel d'offres",
  'Période',
  'Famille',
  'N°CRE',
  'Nom (personne physique) ou raison sociale (personne morale) :',
  'Nom projet',
  'Candidat',
  'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)',
  'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)',
  'Note totale',
  'Nom et prénom du représentant légal',
  'Adresse électronique du contact',
  'N°, voie, lieu-dit',
  'CP',
  'Commune',
  'Classé ?',
  "Motif d'élimination",
  'Investissement ou financement participatif ?',
  'Notification',
  'Engagement de fourniture de puissance à la pointe\n(AO ZNI)',
  'Territoire\n(AO ZNI)',
  'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
  'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)',
]

const columnMapper = {
  appelOffreId,
  periodeId: (line: any) => line['Période'],
  familleId: (line: any) => line.Famille,
  numeroCRE: (line: any) => line['N°CRE'],
  nomProjet: (line: any) => line['Nom projet'],
  nomCandidat: (line: any) =>
    line['Nom (personne physique) ou raison sociale (personne morale) :'] || line['Candidat'],
  puissance: (line: any) =>
    line['Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)'],
  prixReference: (line: any) =>
    line['Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)'],
  note: (line: any) => line['Note totale'],
  nomRepresentantLegal: (line: any) => line['Nom et prénom du représentant légal'],
  email: (line: any) => line['Adresse électronique du contact'],
  adresseProjet: (line: any) => line['N°, voie, lieu-dit'],
  codePostalProjet: (line: any) => line['CP'].split('/').map((item) => item.trim()),
  communeProjet: (line: any) => line['Commune'],
  classe: (line: any) => line['Classé ?'],
  motifsElimination: (line: any) => line["Motif d'élimination"],
  isInvestissementParticipatif: (line: any) => line['Investissement ou financement participatif ?'],
  isFinancementParticipatif: (line: any) => line['Investissement ou financement participatif ?'],
  notifiedOn: (line: any) => line['Notification'],
  engagementFournitureDePuissanceAlaPointe: (line: any) =>
    line['Engagement de fourniture de puissance à la pointe\n(AO ZNI)'],
  territoireProjet: (line: any) => {
    if (appelOffreId(line) !== 'CRE4 - ZNI' && appelOffreId(line) !== 'CRE4 - ZNI 2017') {
      return 'NON-APPLICABLE'
    }

    return line['Territoire\n(AO ZNI)']
  },
  evaluationCarbone: (line: any) =>
    line[
      'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)'
    ] || line['Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)'],
} as const

// Extract raw project data from the columns in a csv line
const extractRawDataFromColumns = (line: any) => {
  return Object.entries(columnMapper).reduce(
    (rawProjectData, [key, mapper]) => ({ ...rawProjectData, [key]: mapper(line) }),
    {}
  )
}

const EMPTY_STRING_OR_DATE_REGEX =
  /^$|(^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)((19)|(20))\d{2}$)/ // Corresponds to DD/MM/YYYY
const DATE_FORMAT = 'DD/MM/YYYY'

const stringToNumber = (fieldName) =>
  z
    .string()
    .nonempty(`${fieldName} est manquant`)
    .transform((nbrStr) => toNumber(nbrStr) as number)
    .refine(
      (val) => typeof val === 'number',
      () => ({ message: `${fieldName} doit être un nombre` })
    )

const strictPositiveNumber = (fieldName) =>
  stringToNumber(fieldName).refine(
    (val) => val > 0,
    () => ({ message: `${fieldName} doit être strictement positif` })
  )
const positiveNumber = (fieldName) =>
  stringToNumber(fieldName).refine(
    (val) => val >= 0,
    () => ({ message: `${fieldName} doit être positif` })
  )

// Parse and validate the rawData of a project
const projectParser = z.object({
  appelOffreId: z.string().nonempty("Appel d'offres manquant"),
  periodeId: z.string().nonempty('Période manquante'),
  familleId: z.string().default(''),
  numeroCRE: z.string().nonempty('N°CRE manquant'),
  nomCandidat: z.string().nonempty('Candidat manquant'),
  nomProjet: z.string().nonempty('Nom projet manquant'),
  puissance: strictPositiveNumber('Le champ Puissance'),
  prixReference: strictPositiveNumber('Le Prix'),
  note: positiveNumber('Le champ Note'),
  nomRepresentantLegal: z.string(),
  email: z
    .string()
    .nonempty(`L'adresse email est manquante`)
    .email(`L'adresse email n'est pas valide`),
  adresseProjet: z.string(),
  codePostalProjet: z
    .string()
    .nonempty('Code Postal manquant')
    .regex(/[0-9]{4,5}/, { message: 'Code Postal mal formé' })
    .array(),
  communeProjet: z.string(),
  classe: z.string().refine(
    (val) => ['Eliminé', 'Classé'].includes(val),
    () => ({
      message: `Le champ 'Classé ?' doit être soit 'Eliminé' soit 'Classé'`,
    })
  ),
  motifsElimination: z.string(),
  isInvestissementParticipatif: z
    .string()
    .refine(
      (val) =>
        ['', 'Investissement participatif (T1)', 'Financement participatif (T2)'].includes(val),
      () => ({
        message: `Le champ 'Investissement ou financement participatif ?' a une valeur erronnée`,
      })
    )
    .transform((str) => str === 'Investissement participatif (T1)'),
  isFinancementParticipatif: z.string().transform((str) => str === 'Financement participatif (T2)'),
  notifiedOn: z
    .string()
    .regex(
      EMPTY_STRING_OR_DATE_REGEX,
      `Le champ 'Notification' est erronné (devrait être vide ou une date de la forme 25/12/2020)`
    )
    .transform((dateStr) => (dateStr ? moment(dateStr, DATE_FORMAT).toDate().getTime() : 0))
    .refine(
      (timestamp) => timestamp < Date.now(),
      () => ({
        message: `Le champ 'Notification' est erronné (devrait être vide ou une date antérieure à aujourd'hui)`,
      })
    )
    .refine(
      (timestamp) =>
        timestamp === 0 || timestamp > moment('01/01/2000', 'DD/MM/YYYY').toDate().getTime(),
      () => ({
        message: "Le champ 'Notification' est erronné (la date parait trop ancienne)",
      })
    ),
  engagementFournitureDePuissanceAlaPointe: z
    .string()
    .refine(
      (val) => ['', 'Oui'].includes(val),
      () => ({
        message: `Le champ 'Engagement de fourniture de puissance à la pointe (AO ZNI)' doit être vide ou 'Oui'`,
      })
    )
    .transform((val) => val === 'Oui'),
  territoireProjet: z
    .string()
    .nonempty("Le champ 'Territoire (AO ZNI)' est requis pour cet Appel d'offres")
    .refine(
      (val) =>
        [
          'NON-APPLICABLE',
          'Corse',
          'Guadeloupe',
          'Guyane',
          'La Réunion',
          'Mayotte',
          'Martinique',
        ].includes(val),
      () => ({
        message: `Le champ 'Territoire (AO ZNI)' a une valeur erronnée`,
      })
    )
    .transform((val) => (val === 'NON-APPLICABLE' ? '' : val)),
  evaluationCarbone: strictPositiveNumber('Le champ Evaluation Carbone'),
})

const appendInfo = (obj, key, value) => {
  if (!obj[key]) {
    obj[key] = value
  } else {
    if (!obj[key].includes(value)) {
      obj[key] += ' / ' + value
    }
  }
}

const getGeoPropertiesFromCodePostal = (codePostalValues) => {
  return codePostalValues
    .map((codePostalValue) => {
      return getDepartementRegionFromCodePostal(codePostalValue)
    })
    .filter((item) => !!item)
    .reduce(
      (geoInfo, departementRegion) => {
        const { codePostal, region, departement } = departementRegion

        appendInfo(geoInfo, 'codePostalProjet', codePostal)
        appendInfo(geoInfo, 'departementProjet', departement)
        appendInfo(geoInfo, 'regionProjet', region)

        return geoInfo
      },
      {
        codePostalProjet: '',
        departementProjet: '',
        regionProjet: '',
      }
    )
}

export const parseProjectLine = (line) => {
  try {
    const rawProjectData = projectParser.parse(extractRawDataFromColumns(line))

    const { codePostalProjet, departementProjet, regionProjet } = getGeoPropertiesFromCodePostal(
      rawProjectData.codePostalProjet
    )

    return {
      ...rawProjectData,
      codePostalProjet,
      departementProjet,
      regionProjet,
      puissanceInitiale: rawProjectData.puissance,
      details: Object.entries(line)
        .filter(([key, value]) => !mappedColumns.includes(key) && !!value)
        .reduce((details, [key, value]) => ({ ...details, [key]: value }), {}),
    }
  } catch (e) {
    throw new Error(e.errors.map((err) => err.message).join(', '))
  }
}
