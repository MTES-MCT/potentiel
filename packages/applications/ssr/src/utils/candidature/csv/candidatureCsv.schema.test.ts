import { test, describe } from 'node:test';

import { expect, assert } from 'chai';

import '../../zod/setupLocale';
import { CandidatureCsvRowShape, candidatureCsvSchema, CandidatureShape } from '..';

import { assertError, assertNoError, deepEqualWithRichDiff } from './_test-shared';

const minimumValues: Partial<Record<keyof CandidatureCsvRowShape, string>> = {
  "Appel d'offres": "appel d'offre",
  'N°CRE': 'numéro cre',
  'Nom projet': 'nom projet',
  Candidat: 'candidat',
  Période: 'période',
  puissance_production_annuelle: '1',
  prix_reference: '1',
  'Note totale': '1',
  'Nom et prénom du représentant légal': 'valentin cognito',
  'Adresse électronique du contact': 'porteur@test.com',
  'N°, voie, lieu-dit 1': 'adresse ',
  CP: '13000',
  Commune: 'MARSEILLE',
  'Gouvernance partagée (Oui/Non)': 'Oui',
  'Financement collectif (Oui/Non)': 'Non',
  'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
    'N/A',
  'Technologie\n(dispositif de production)': '',
  "1. Lauréat d'aucun AO\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'un AO":
    '1',
};

const minimumValuesEliminé: typeof minimumValues = {
  ...minimumValues,
  'Classé ?': 'Eliminé',
  "Motif d'élimination": 'motif',
};
const minimumValuesClassé: typeof minimumValues = {
  ...minimumValues,
  'Classé ?': 'Classé',
  "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
    '2',
  "Date d'échéance au format JJ/MM/AAAA": '01/12/2024',
  puissance_projet_initial: '1',
};

describe('Schema candidature CSV', () => {
  test('Cas nominal : éliminé', () => {
    const result = candidatureCsvSchema.safeParse({
      ...minimumValuesEliminé,
    });
    assertNoError(result);
    const expected: CandidatureShape = {
      appelOffre: "appel d'offre",
      période: 'période',
      famille: '',
      numéroCRE: 'numéro cre',
      nomProjet: 'nom projet',
      sociétéMère: '',
      nomCandidat: 'candidat',
      puissance: 1,
      prixReference: 1,
      noteTotale: 1,
      nomReprésentantLégal: 'valentin cognito',
      emailContact: 'porteur@test.com',
      statut: 'éliminé',
      motifÉlimination: 'motif',
      puissanceALaPointe: false,
      evaluationCarboneSimplifiée: 0,
      technologie: 'N/A',
      typeGarantiesFinancières: undefined,
      dateÉchéanceGf: undefined,
      historiqueAbandon: 'première-candidature',
      territoireProjet: '',
      coefficientKChoisi: undefined,
      obligationDeSolarisation: undefined,
      puissanceDeSite: undefined,
      installateur: undefined,
      natureDeLExploitation: undefined,
      actionnariat: 'gouvernance-partagée',
      autorisationDUrbanisme: undefined,
      typologieInstallation: [],
      localité: {
        adresse1: 'adresse',
        adresse2: '',
        codePostal: '13000',
        commune: 'MARSEILLE',
        département: 'Bouches-du-Rhône',
        région: "Provence-Alpes-Côte d'Azur",
      },
      dispositifDeStockage: undefined,
      puissanceProjetInitial: undefined,
    };

    deepEqualWithRichDiff(result.data, expected);
  });

  test('Cas nominal : classé', () => {
    const result = candidatureCsvSchema.safeParse(minimumValuesClassé);
    assertNoError(result);
    const expected: CandidatureShape = {
      appelOffre: "appel d'offre",
      période: 'période',
      famille: '',
      numéroCRE: 'numéro cre',
      nomProjet: 'nom projet',
      sociétéMère: '',
      nomCandidat: 'candidat',
      puissance: 1,
      prixReference: 1,
      noteTotale: 1,
      nomReprésentantLégal: 'valentin cognito',
      emailContact: 'porteur@test.com',
      statut: 'classé',
      motifÉlimination: undefined,
      puissanceALaPointe: false,
      evaluationCarboneSimplifiée: 0,
      technologie: 'N/A',
      localité: {
        adresse1: 'adresse',
        adresse2: '',
        codePostal: '13000',
        commune: 'MARSEILLE',
        département: 'Bouches-du-Rhône',
        région: "Provence-Alpes-Côte d'Azur",
      },
      typeGarantiesFinancières: 'avec-date-échéance',
      dateÉchéanceGf: '2024-12-01T00:00:00.000Z',
      historiqueAbandon: 'première-candidature',
      territoireProjet: '',
      coefficientKChoisi: undefined,
      obligationDeSolarisation: undefined,
      puissanceDeSite: undefined,
      actionnariat: 'gouvernance-partagée',
      installateur: undefined,
      typologieInstallation: [],
      autorisationDUrbanisme: undefined,
      natureDeLExploitation: undefined,
      dispositifDeStockage: undefined,
      puissanceProjetInitial: 1,
    };
    deepEqualWithRichDiff(result.data, expected);
  });

  test('Champs optionnels, spécifiques à certains AOs', () => {
    const result = candidatureCsvSchema.safeParse({
      ...minimumValuesClassé,
      'Technologie\n(dispositif de production)': 'Eolien',
      'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': 'Oui',
      'Installations agrivoltaïques': 'Jachère de plus de 5 ans',
      'Eléments sous l’ombrière': `Ce qu'il y a sous l'ombrière`,
      'Typologie de bâtiment': 'Bâtiment existant avec rénovation de toiture',
      'Obligation de solarisation': 'Oui',
      "Date d'obtention de l'autorisation d'urbanisme": '21/08/2025',
      "Numéro de l'autorisation d'urbanisme": '123',
      "Identité de l'installateur": 'Installateur Inc.',
      'Installation couplée à un dispositif de stockage': 'oui',
      'Capacité du dispositif de stockage': '2',
      'Puissance du dispositif de stockage': '3',
      "Nature de l'exploitation": 'Vente avec injection du surplus',
      "Taux d'autoconsommation individuelle (ACI) prévisionnel": '32',
    });
    assertNoError(result);
    const expected: CandidatureShape = {
      appelOffre: "appel d'offre",
      période: 'période',
      famille: '',
      numéroCRE: 'numéro cre',
      nomProjet: 'nom projet',
      sociétéMère: '',
      nomCandidat: 'candidat',
      puissance: 1,
      prixReference: 1,
      noteTotale: 1,
      nomReprésentantLégal: 'valentin cognito',
      emailContact: 'porteur@test.com',
      statut: 'classé',
      motifÉlimination: undefined,
      puissanceALaPointe: true,
      evaluationCarboneSimplifiée: 0,
      technologie: 'eolien',
      dateÉchéanceGf: '2024-12-01T00:00:00.000Z',
      historiqueAbandon: 'première-candidature',
      territoireProjet: '',
      coefficientKChoisi: undefined,
      obligationDeSolarisation: true,
      puissanceDeSite: undefined,
      installateur: 'Installateur Inc.',
      localité: {
        adresse1: 'adresse',
        adresse2: '',
        commune: 'MARSEILLE',
        codePostal: '13000',
        département: 'Bouches-du-Rhône',
        région: "Provence-Alpes-Côte d'Azur",
      },
      typeGarantiesFinancières: 'avec-date-échéance',
      actionnariat: 'gouvernance-partagée',
      autorisationDUrbanisme: { date: '2025-08-21T00:00:00.000Z', numéro: '123' },
      natureDeLExploitation: {
        typeNatureDeLExploitation: 'vente-avec-injection-du-surplus',
        tauxPrévisionnelACI: 32,
      },
      typologieInstallation: [
        {
          typologie: 'agrivoltaïque.jachère-plus-de-5-ans',
        },
        {
          typologie: 'bâtiment.existant-avec-rénovation-de-toiture',
        },
        {
          typologie: 'ombrière.autre',
          détails: "Ce qu'il y a sous l'ombrière",
        },
      ],
      dispositifDeStockage: {
        installationAvecDispositifDeStockage: true,
        capacitéDuDispositifDeStockageEnKWh: 2,
        puissanceDuDispositifDeStockageEnKW: 3,
      },
      puissanceProjetInitial: 1,
    };

    deepEqualWithRichDiff(result.data, expected);
  });

  describe('Erreurs courantes', () => {
    test('chaîne de caractères obligatoire sans valeur', () => {
      const result = candidatureCsvSchema.safeParse({});
      assertError(result, ["Appel d'offres"], 'Le champ est requis');
    });

    test('chaîne de caractères obligatoire avec valeur vide', () => {
      const result = candidatureCsvSchema.safeParse({
        "Appel d'offres": '',
      });
      assertError(result, ["Appel d'offres"], 'Le champ est requis');
    });

    test('chaîne de caractères obligatoire avec espaces', () => {
      const result = candidatureCsvSchema.safeParse({
        "Appel d'offres": ' ',
      });
      assertError(result, ["Appel d'offres"], 'Le champ est requis');
    });

    test('nombre avec caractères', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        puissance_production_annuelle: 'abcd',
        'Note totale': 'abcd',
      });
      assertError(
        result,
        ['puissance_production_annuelle'],
        'Le champ doit être un nombre positif',
        0,
      );
      assertError(result, ['Note totale'], 'Le champ doit être un nombre', 1);
    });

    test('nombre strictement positif optionnel vide', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)': '',
      });

      assertNoError(result);
    });

    test('nombre strictement positif requis vide', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        puissance_production_annuelle: '',
      });
      assertError(
        result,
        ['puissance_production_annuelle'],
        'Le champ doit être un nombre positif',
      );
    });

    test('nombre strictement positif vaut 0', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        puissance_production_annuelle: 0,
      });
      assertError(
        result,
        ['puissance_production_annuelle'],
        'Le champ doit être un nombre positif',
      );
    });

    test('nombre strictement positif avec valeur négative', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        puissance_production_annuelle: 0,
      });
      assertError(
        result,
        ['puissance_production_annuelle'],
        'Le champ doit être un nombre positif',
      );
    });

    test('oui/non avec valeur invalide', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        'Gouvernance partagée (Oui/Non)': 'peut-être',
      });
      assertError(
        result,
        ['Gouvernance partagée (Oui/Non)'],
        'Option invalide : une valeur parmi "true"|"oui"|"false"|"non" attendue',
      );
    });

    test('oui/non/undefined avec valeur', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        indexation_k: 'oui',
      });
      expect(result.data?.coefficientKChoisi).to.equal(true);
    });

    test('oui/non/undefined sans valeur', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        indexation_k: '',
      });
      expect(result.data?.coefficientKChoisi).to.equal(undefined);
    });

    test('Enum avec valeur invalide', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        'Classé ?': 'wrong',
      });
      assertError(
        result,
        ['Classé ?'],
        'Option invalide : une valeur parmi "eliminé"|"éliminé"|"classé"|"retenu" attendue',
      );
    });

    test('Enum avec valeur vide', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
          '',
      });
      assert(result.success);
      expect(result.data.typeGarantiesFinancières).to.be.undefined;
    });

    test('Enum avec N/A', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
          'N/A',
      });
      assert(result.success);
      expect(result.data.typeGarantiesFinancières).to.be.undefined;
    });

    test('Email non valide', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        'Adresse électronique du contact': 'wrong',
      });
      assertError(result, ['Adresse électronique du contact'], 'adresse e-mail invalide');
    });

    test('Date invalide', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        "Date d'échéance au format JJ/MM/AAAA": '00/01/2000',
      });
      assert(!result.success);
      expect(result.error.issues[0]).to.deep.eq({
        code: 'custom',
        message: 'La date a une valeur invalide',
        path: ["Date d'échéance au format JJ/MM/AAAA"],
      });
    });
  });

  describe('Règles métier', () => {
    test("Motif d'élimination n'est pas obligatoire si classé", () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        'Classé ?': 'Classé',
        "Motif d'élimination": undefined,
        "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
          '1',
      });
      assertNoError(result);
    });

    test("Motif d'élimination est obligatoire si éliminé", () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        "Motif d'élimination": undefined,
      });
      assert(!result.success);
      expect(result.error.issues[0]).to.deep.eq({
        code: 'invalid_type',
        expected: 'string',
        received: undefined,
        path: ["Motif d'élimination"],
        message: `"Motif d'élimination" est requis lorsque "Classé ?" a la valeur "éliminé"`,
      });
    });

    test("Date d'échéance est obligatoire si GF avec date d'échéance", () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        'Classé ?': 'Classé',
        "Motif d'élimination": undefined,
        "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
          '2',
      });
      assert(!result.success);
      expect(result.error.issues[0]).to.deep.eq({
        code: 'invalid_type',
        expected: 'string',
        received: undefined,
        path: ["Date d'échéance au format JJ/MM/AAAA"],
        message: `"Date d'échéance au format JJ/MM/AAAA" est requis lorsque "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation" a la valeur "2"`,
      });
    });

    test("Date d'échéance n'est pas obligatoire si GF avec date d'échéance, mais éliminé", () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        'Classé ?': 'Eliminé',
        "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
          '2',
      });
      assertNoError(result);
    });

    test('notifiedOn est interdit', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        notifiedOn: 'foo',
      });
      assert(!result.success, 'should be error');
      expect(result.error.issues[0]).to.deep.eq({
        expected: 'undefined',
        code: 'invalid_type',
        path: ['notifiedOn'],
        message: 'Le champs notifiedOn ne peut pas être présent',
      });
    });

    test('financement collectif et gouvernance partagée sont exclusifs', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        'Financement collectif (Oui/Non)': 'Oui',
        'Gouvernance partagée (Oui/Non)': 'Oui',
      });
      assert(!result.success);
      expect(result.error.issues[0]).to.deep.eq({
        code: 'custom',
        message: `Seule l'une des deux colonnes "Financement collectif (Oui/Non)" et "Gouvernance partagée (Oui/Non)" peut avoir la valeur "Oui"`,
        path: ['Financement collectif (Oui/Non)', 'Gouvernance partagée (Oui/Non)'],
      });
    });

    test('le type de GF est obligatoire pour projet classé PPE2', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesClassé,
        "Appel d'offres": 'PPE2 - Eolien',
        "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
          undefined,
      });
      assert(!result.success);
      expect(result.error.issues[0]).to.deep.eq({
        code: 'invalid_type',
        expected: 'string',
        received: undefined,
        path: [
          "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation",
        ],
        message:
          '"1. Garantie financière jusqu\'à 6 mois après la date d\'achèvement\n2. Garantie financière avec date d\'échéance et à renouveler\n3. Consignation" est requis lorsque "Classé ?" a la valeur "classé"',
      });
    });

    test("le type de GF n'est pas obligatoire pour projet classé CRE4", () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesClassé,
        "Appel d'offres": 'Eolien',
        "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
          undefined,
      });
      assertNoError(result);
    });

    test('Installation couplée à un dispositif de stockage requiert sa capacité et puissance', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesClassé,
        'Installation couplée à un dispositif de stockage': 'oui',
      });
      assert(!result.success);
      expect(result.error.issues[0]).to.deep.eq({
        code: 'custom',
        path: ['Capacité du dispositif de stockage', 'Puissance du dispositif de stockage'],
        message: 'La capacité et la puissance du dispositif de stockage sont requises',
      });
    });
  });

  describe('Cas particuliers', () => {
    describe('Statut', () => {
      test('accepte la valeur "retenu" comme valant "classé"', () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesClassé,
          'Classé ?': 'Retenu',
        });
        assertNoError(result);
        expect(result.data.statut).to.equal('classé');
      });
    });
    describe('Evaluation carbone', () => {
      test('accepte N/A', () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesEliminé,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            'N/A',
        });
        assertNoError(result);
      });
      test('accepte vide', () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesEliminé,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '',
        });
        assertNoError(result);
      });

      test('accepte un nombre positif', () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesEliminé,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '1',
        });
        assert(result.success);
      });

      test(`n'accepte pas un nombre négatif`, () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesEliminé,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '-1',
        });
        assert(!result.success);
      });

      test(`n'accepte pas du texte`, () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesEliminé,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            'abcd',
        });
        assert(!result.success);
      });
    });

    describe('Code postal', () => {
      test('accepte un code postal valide', () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesClassé,
          CP: '33100',
        });
        assertNoError(result);
      });

      test("n'accepte pas un code postal invalide", () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesClassé,
          CP: 'invalide',
        });

        assert(!result.success, 'should be error');
        expect(result.error.issues[0]).to.deep.eq({
          code: 'custom',
          path: ['CP'],
          message: 'Le code postal ne correspond à aucune région / département',
        });
      });

      test("n'accepte pas un code postal vide", () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesClassé,
          CP: '',
        });

        assert(!result.success, 'should be error');
        expect(result.error.issues[0]).to.deep.eq({
          code: 'custom',
          path: ['CP'],
          message: 'Le code postal est requis',
        });
      });

      test("n'accepte pas un code postal inexistant", () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesClassé,
          CP: '99999',
        });

        assert(!result.success, 'should be error');
        expect(result.error.issues[0]).to.deep.eq({
          code: 'custom',
          path: ['CP'],
          message: 'Le code postal ne correspond à aucune région / département',
        });
      });

      test("plusieurs codes postaux séparés par des '/' sont acceptés", () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesClassé,
          CP: ' 33100 / 75001 /  13001 ',
        });
        assert(result.success);
        expect(result.data.localité.codePostal).to.deep.equal('33100 / 75001 / 13001');
      });

      test('si le CP fait moins de 5 caractères, il est complété par des 0 à gauche (transformation MS Excel)', () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesClassé,
          CP: '3340',
        });
        assert(result.success);
        expect(result.data.localité.codePostal).to.deep.equal('03340');
      });
    });

    describe('Adresse', () => {
      test('au minimum un champs doit être spécifié', () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesClassé,
          'N°, voie, lieu-dit 1': undefined,
        });
        assert(!result.success, 'should be error');
        expect(result.error.issues[0]).to.deep.eq({
          code: 'custom',
          path: ['N°, voie, lieu-dit 1', 'N°, voie, lieu-dit 2'],
          message: `L'une des deux colonnes "N°, voie, lieu-dit 1" et "N°, voie, lieu-dit 2" doit être renseignée`,
        });
      });
      test('soit adresse 1 soit adresse 2 peut être spécifiée', () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesClassé,
          'N°, voie, lieu-dit 1': undefined,
          'N°, voie, lieu-dit 2': 'adresse',
        });
        assertNoError(result);
      });
    });

    describe('Date', () => {
      test(`la date '00/01/1900' équivaut à vide`, () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesEliminé,
          "Date d'échéance au format JJ/MM/AAAA": '00/01/1900',
        });
        assert(result.success);
        expect(result.data.dateÉchéanceGf).to.be.undefined;
      });
    });
  });
});
