import * as yup from 'yup';
import moment from 'moment-timezone';
import getDepartementRegionFromCodePostal from '../../../helpers/getDepartementRegionFromCodePostal';
moment.tz.setDefault('Europe/Paris');

const appelOffreId = (line: any) => line["Appel d'offres"];

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
  'N°, voie, lieu-dit 1',
  'N°, voie, lieu-dit 2',
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
  'Technologie\n(dispositif de production)',
  'Financement collectif (Oui/Non)',
  'Gouvernance partagée (Oui/Non)',
];

const prepareNumber = (str) => str && str.replace(/,/g, '.');

const padCodePostalWithleft0 = (codePostalProjet) => {
  if (codePostalProjet.length === 4) {
    return `0${codePostalProjet}`;
  }

  return codePostalProjet;
};

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
      line['Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)'],
    ),
  prixReference: (line: any) => {
    const prix = prepareNumber(
      line['Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)'],
    );

    if (prix === '') return null;

    if (Number(prix) === 0 && !appelOffreId(line).includes('Autoconsommation')) return -1;

    return prix;
  },
  note: (line: any) => prepareNumber(line['Note totale']),
  nomRepresentantLegal: (line: any) => line['Nom et prénom du représentant légal'],
  email: (line: any) => line['Adresse électronique du contact'].toLowerCase(),
  adresseProjet: (line: any) => {
    if (line['N°, voie, lieu-dit 1'] && line['N°, voie, lieu-dit 2']) {
      return `${line['N°, voie, lieu-dit 1']}\n${line['N°, voie, lieu-dit 2']}`;
    }

    if (line['N°, voie, lieu-dit 1']) {
      return line['N°, voie, lieu-dit 1'];
    }

    if (line['N°, voie, lieu-dit 2']) {
      return line['N°, voie, lieu-dit 2'];
    }

    return line['N°, voie, lieu-dit'];
  },
  codePostalProjet: (line: any) =>
    line['CP'].split('/').map((item) => padCodePostalWithleft0(item.trim())),
  communeProjet: (line: any) => line['Commune'],
  classe: (line: any) => line['Classé ?'],
  motifsElimination: (line: any) => line["Motif d'élimination"],
  isInvestissementParticipatif: (line: any) => line['Investissement ou financement participatif ?'],
  isFinancementParticipatif: (line: any) => line['Investissement ou financement participatif ?'],
  notifiedOn: (line: any) => {
    const notifiedDate = line['Notification'];
    if (notifiedDate === '') return 0;

    const parsed = moment(notifiedDate, DATE_FORMAT);
    if (parsed.isValid()) return parsed.toDate().getTime();

    return null;
  },
  engagementFournitureDePuissanceAlaPointe: (line: any) =>
    line['Engagement de fourniture de puissance à la pointe\n(AO ZNI)'],
  territoireProjet: (line: any) => {
    if (appelOffreId(line) !== 'CRE4 - ZNI' && appelOffreId(line) !== 'CRE4 - ZNI 2017') {
      return 'NON-APPLICABLE';
    }

    if (line['Territoire\n(AO ZNI)'] === '') return 'MISSING';

    return line['Territoire\n(AO ZNI)'];
  },
  evaluationCarbone: (line: any) => {
    const ecs = prepareNumber(
      line[
        'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)'
      ] || line['Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)'],
    );

    if (ecs === '' || typeof ecs === 'undefined') return null;

    if (ecs === 'N/A') return 0;

    if (Number(ecs) === 0) return -1;

    return ecs;
  },
  technologie: (line: any) => {
    if (!line.hasOwnProperty('Technologie\n(dispositif de production)')) return 'N/A';
    const technologie = line['Technologie\n(dispositif de production)'];
    if (technologie === 'Eolien') return 'eolien';
    if (technologie === 'Hydraulique') return 'hydraulique';
    if (technologie === '') return 'pv';
    return null;
  },
  actionnariat: (line: any) => {
    if (
      !['Oui', 'Non', '', undefined].includes(line['Financement collectif (Oui/Non)']) ||
      !['Oui', 'Non', '', undefined].includes(line['Gouvernance partagée (Oui/Non)'])
    ) {
      return 'wrong-value';
    }

    if (
      line['Financement collectif (Oui/Non)'] === 'Oui' &&
      line['Gouvernance partagée (Oui/Non)'] === 'Oui'
    ) {
      return 'not-possible';
    }

    if (line['Financement collectif (Oui/Non)'] === 'Oui') {
      return 'financement-collectif';
    }
    if (line['Gouvernance partagée (Oui/Non)'] === 'Oui') {
      return 'gouvernance-partagee';
    }
    return null;
  },
} as const;

// Extract raw project data from the columns in a csv line
const extractRawDataFromColumns = (line: any) => {
  return Object.entries(columnMapper).reduce(
    (rawProjectData, [key, mapper]) => ({ ...rawProjectData, [key]: mapper(line) }),
    {},
  );
};

const DATE_FORMAT = 'DD/MM/YYYY';

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
  adresseProjet: yup.string().required(`L'adresse du projet est manquante`),
  codePostalProjet: yup.array().of(
    yup
      .string()
      .required('Code Postal manquant')
      .matches(/^(([0-8][0-9])|(9[0-7]))[0-9]{3}$/, 'Code Postal mal formé'),
  ),
  communeProjet: yup.string().required(),
  classe: yup
    .mixed()
    .oneOf(['Eliminé', 'Classé'], `Le champ 'Classé ?' doit être soit 'Eliminé' soit 'Classé'`),
  motifsElimination: yup.string().ensure(),
  isInvestissementParticipatif: yup
    .boolean()
    .transform((str) => {
      if (str === 'Investissement participatif (T1)') return true;
      if (str === 'Financement participatif (T2)') return false;
      if (str === '') return false;

      return null; // will result in error
    })
    .typeError(`Le champ 'Investissement ou financement participatif ?' a une valeur erronnée`)
    .required(),
  isFinancementParticipatif: yup
    .boolean()
    .transform((str) => {
      if (str === 'Investissement participatif (T1)') return false;
      if (str === 'Financement participatif (T2)') return true;
      if (str === '') return false;

      return null; // will result in error
    })
    .typeError(`Le champ 'Investissement ou financement participatif ?' a une valeur erronnée`)
    .required(),
  notifiedOn: yup
    .number()
    .typeError(
      "Le champ 'Notification' est erronné (devrait être vide ou une date de la forme 25/12/2020)",
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
      if (str === 'Oui') return true;
      if (str === '') return false;

      return null; // will result in error
    })
    .typeError(
      `Le champ 'Engagement de fourniture de puissance à la pointe (AO ZNI)' doit être vide ou 'Oui'`,
    )
    .required(),
  territoireProjet: yup.lazy((str) => {
    if (str === 'NON-APPLICABLE' || str === '') return yup.string().transform(() => '');

    if (str === 'MISSING' || str === null)
      return yup
        .string()
        .transform(() => null)
        .typeError("Le champ 'Territoire (AO ZNI)' est requis pour cet Appel d'offres");

    return yup
      .mixed()
      .oneOf(
        ['Corse', 'Guadeloupe', 'Guyane', 'La Réunion', 'Mayotte', 'Martinique'],
        `Le champ 'Territoire (AO ZNI)' a une valeur erronnée`,
      )
      .required();
  }),
  evaluationCarbone: yup
    .number()
    .typeError('Le champ Evaluation carbone doit contenir un nombre')
    .min(0, 'Le champ Evaluation Carbone doit contenir un nombre strictement positif')
    .required(),
  technologie: yup
    .mixed()
    .oneOf(
      ['pv', 'hydraulique', 'eolien', 'N/A'],
      'Le champ "Technologie" peut contenir les valeurs "Hydraulique", "Eolien" ou rester vide pour la technologie PV',
    ),
  actionnariat: yup.lazy((str) => {
    if (str === 'wrong-value') {
      return yup
        .boolean()
        .typeError(
          `Les champs Financement collectif et Gouvernance partagée doivent être soit 'Oui' soit 'Non'`,
        );
    }

    return yup
      .mixed()
      .nullable()
      .oneOf(
        ['gouvernance-partagee', 'financement-collectif', null],
        'Les deux champs Financement collectif et Gouvernance partagée ne peuvent pas être tous les deux à "Oui"',
      );
  }),
});

const appendInfo = (obj, key, value) => {
  if (!obj[key]) {
    obj[key] = value;
  } else {
    if (!obj[key].includes(value)) {
      obj[key] += ' / ' + value;
    }
  }
};

const getGeoPropertiesFromCodePostal = (codePostalValues) => {
  return codePostalValues
    .map((codePostalValue) => {
      return getDepartementRegionFromCodePostal(codePostalValue);
    })
    .filter((item) => !!item)
    .reduce(
      (geoInfo, departementRegion) => {
        const { codePostal, region, departement } = departementRegion;

        appendInfo(geoInfo, 'codePostalProjet', codePostal);
        appendInfo(geoInfo, 'departementProjet', departement);
        appendInfo(geoInfo, 'regionProjet', region);

        return geoInfo;
      },
      {
        codePostalProjet: '',
        departementProjet: '',
        regionProjet: '',
      },
    );
};

export const parseProjectLine = (line) => {
  try {
    const rawProjectData = projectSchema.validateSync(extractRawDataFromColumns(line));

    const { codePostalProjet, departementProjet, regionProjet } = getGeoPropertiesFromCodePostal(
      rawProjectData.codePostalProjet,
    );

    if (!departementProjet || !regionProjet) {
      throw new yup.ValidationError('Le Code Postal ne correspond à aucun département');
    }

    return {
      ...rawProjectData,
      codePostalProjet,
      departementProjet,
      regionProjet,
      puissanceInitiale: rawProjectData.puissance,
      details: Object.entries(line)
        .filter(([key, value]) => !mappedColumns.includes(key) && !!value)
        .reduce((details, [key, value]) => ({ ...details, [key]: value }), {}),
    };
  } catch (e) {
    if (e.errors) {
      throw new Error(e.errors.join(', '));
    }

    throw e;
  }
};
