import * as yup from 'yup'
import moment from 'moment-timezone'
import getDepartementRegionFromCodePostal from '../../../helpers/getDepartementRegionFromCodePostal'
moment.tz.setDefault('Europe/Paris')

const appelOffreId = (line: any) => line["Appel d'offres"]

const mappedColumns = [
  "Appel d'offres",
  'Période',
  'Famille',
  'N°CRE',
  'Nom (personne physique) ou raison sociale (personne morale) :',
  'Nom projet',
  'Société mère',
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

const prepareNumber = (str) => str.replace(/,/g, '.')

const columnMapper = {
  appelOffreId,
  periodeId: (line: any) => line['Période'],
  familleId: (line: any) => line.Famille,
  numeroCRE: (line: any) => line['N°CRE'],
  nomProjet: (line: any) => line['Nom projet'],
  actionnaire: (line: any) => line['Société mère'],
  nomCandidat: (line: any) =>
    line['Nom (personne physique) ou raison sociale (personne morale) :'] || line['Candidat'],
  puissance: (line: any) =>
    prepareNumber(
      line['Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)']
    ),
  prixReference: (line: any) => {
    const prix = prepareNumber(
      line['Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)']
    )

    if (prix === '') return null

    if (Number(prix) === 0 && !appelOffreId(line).includes('Autoconsommation')) return -1

    return prix
  },
  note: (line: any) => prepareNumber(line['Note totale']),
  nomRepresentantLegal: (line: any) => line['Nom et prénom du représentant légal'],
  email: (line: any) => line['Adresse électronique du contact'],
  adresseProjet: (line: any) => line['N°, voie, lieu-dit'],
  codePostalProjet: (line: any) => line['CP'].split('/').map((item) => item.trim()),
  communeProjet: (line: any) => line['Commune'],
  classe: (line: any) => line['Classé ?'],
  motifsElimination: (line: any) => line["Motif d'élimination"],
  isInvestissementParticipatif: (line: any) => line['Investissement ou financement participatif ?'],
  isFinancementParticipatif: (line: any) => line['Investissement ou financement participatif ?'],
  notifiedOn: (line: any) => {
    const notifiedDate = line['Notification']
    if (notifiedDate === '') return 0

    const parsed = moment(notifiedDate, DATE_FORMAT)
    if (parsed.isValid()) return parsed.toDate().getTime()

    return null
  },
  engagementFournitureDePuissanceAlaPointe: (line: any) =>
    line['Engagement de fourniture de puissance à la pointe\n(AO ZNI)'],
  territoireProjet: (line: any) => {
    if (appelOffreId(line) !== 'CRE4 - ZNI' && appelOffreId(line) !== 'CRE4 - ZNI 2017') {
      return 'NON-APPLICABLE'
    }

    if (line['Territoire\n(AO ZNI)'] === '') return 'MISSING'

    return line['Territoire\n(AO ZNI)']
  },
  evaluationCarbone: (line: any) => {
    const ecs = prepareNumber(
      line[
        'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)'
      ] || line['Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)']
    )

    if (ecs === '') return null

    if (ecs === 'N/A') return 0

    if (Number(ecs) === 0) return -1

    return ecs
  },
} as const

// Extract raw project data from the columns in a csv line
const extractRawDataFromColumns = (line: any) => {
  return Object.entries(columnMapper).reduce(
    (rawProjectData, [key, mapper]) => ({ ...rawProjectData, [key]: mapper(line) }),
    {}
  )
}

const DATE_FORMAT = 'DD/MM/YYYY'

const projectSchema = yup.object().shape({
  appelOffreId: yup.string().required("Appel d'offres manquant"),
  periodeId: yup.string().required('Période manquante'),
  familleId: yup.string().default(''),
  numeroCRE: yup.string().required('N°CRE manquant'),
  nomCandidat: yup.string().required('Candidat manquant'),
  actionnaire: yup.string().ensure(),
  nomProjet: yup.string().required('Nom projet manquant'),
  puissance: yup
    .number()
    .typeError('Le champ Puissance doit être un nombre')
    .positive('Le champ Puissance doit être strictement positif')
    .required(),
  prixReference: yup
    .number()
    .typeError('Le Prix doit être un nombre')
    .min(0, 'Le champ Prix doit être strictement positif')
    .required(),
  note: yup
    .number()
    .typeError('Le champ Note doit contenir un nombre')
    .min(0, 'Le champ Note doit être un nombre positif')
    .required(),
  nomRepresentantLegal: yup
    .string()
    .required("Le champ 'Nom et prénom du représentant légal' doit être rempli"),
  email: yup
    .string()
    .email(`L'adresse email n'est pas valide`)
    .required(`L'adresse email est manquante`),
  adresseProjet: yup.string().required(),
  codePostalProjet: yup.array().of(
    yup
      .string()
      .required('Code Postal manquant')
      .matches(/[0-9]{4,5}/, 'Code Postal mal formé')
  ),
  communeProjet: yup.string().required(),
  classe: yup
    .mixed()
    .oneOf(['Eliminé', 'Classé'], `Le champ 'Classé ?' doit être soit 'Eliminé' soit 'Classé'`),
  motifsElimination: yup.string().ensure(),
  isInvestissementParticipatif: yup
    .boolean()
    .transform((str) => {
      if (str === 'Investissement participatif (T1)') return true
      if (str === 'Financement participatif (T2)') return false
      if (str === '') return false

      return null // will result in error
    })
    .typeError(`Le champ 'Investissement ou financement participatif ?' a une valeur erronnée`)
    .required(),
  isFinancementParticipatif: yup
    .boolean()
    .transform((str) => {
      if (str === 'Investissement participatif (T1)') return false
      if (str === 'Financement participatif (T2)') return true
      if (str === '') return false

      return null // will result in error
    })
    .typeError(`Le champ 'Investissement ou financement participatif ?' a une valeur erronnée`)
    .required(),
  notifiedOn: yup
    .number()
    .typeError(
      "Le champ 'Notification' est erronné (devrait être vide ou une date de la forme 25/12/2020)"
    )
    .test({
      name: 'is-notification-date-too-recent',
      message: `Le champ 'Notification' est erronné (devrait une date antérieure à aujourd'hui)`,
      test: (value) => value === 0 || (!!value && value < Date.now()),
    })
    .test({
      name: 'is-notification-date-too-old',
      message: "Le champ 'Notification' est erronné (la date parait trop ancienne)",
      test: (value) =>
        value === 0 || (!!value && value > moment('01/01/2000', 'DD/MM/YYYY').toDate().getTime()),
    })
    .required(),
  engagementFournitureDePuissanceAlaPointe: yup
    .boolean()
    .transform((str) => {
      if (str === 'Oui') return true
      if (str === '') return false

      return null // will result in error
    })
    .typeError(
      `Le champ 'Engagement de fourniture de puissance à la pointe (AO ZNI)' doit être vide ou 'Oui'`
    )
    .required(),
  territoireProjet: yup.lazy((str) => {
    if (str === 'NON-APPLICABLE' || str === '') return yup.string().transform(() => '')

    if (str === 'MISSING' || str === null)
      return yup
        .string()
        .transform(() => null)
        .typeError("Le champ 'Territoire (AO ZNI)' est requis pour cet Appel d'offres")

    return yup
      .mixed()
      .oneOf(
        ['Corse', 'Guadeloupe', 'Guyane', 'La Réunion', 'Mayotte', 'Martinique'],
        `Le champ 'Territoire (AO ZNI)' a une valeur erronnée`
      )
      .required()
  }),
  evaluationCarbone: yup
    .number()
    .typeError('Le champ Evaluation carbone doit contenir un nombre')
    .min(0, 'Le champ Evaluation Carbone doit contenir un nombre strictement positif')
    .required(),
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
    // const rawProjectData = projectParser.parse(extractRawDataFromColumns(line))
    const rawProjectData = projectSchema.validateSync(extractRawDataFromColumns(line))

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
    // console.log(e.errors)
    throw new Error(e.errors.join(', '))
  }
}
