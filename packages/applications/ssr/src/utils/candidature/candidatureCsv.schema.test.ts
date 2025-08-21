import { test, describe } from 'node:test';

import { expect, assert } from 'chai';
import { SafeParseReturnType, SafeParseSuccess } from 'zod';

import { CandidatureCsvRowShape, candidatureCsvSchema, CandidatureShape } from '.';

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
  CP: '12345',
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
};

function assertNoError<TInput, TOutput>(
  result: SafeParseReturnType<TInput, TOutput>,
): asserts result is SafeParseSuccess<TOutput> {
  if (!result.success) {
    expect(result.error).to.be.undefined;
  }
  assert(result.success);
}

describe('Schema candidature', () => {
  test('Cas nominal, éliminé', () => {
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
      puissanceProductionAnnuelle: 1,
      prixReference: 1,
      noteTotale: 1,
      nomReprésentantLégal: 'valentin cognito',
      emailContact: 'porteur@test.com',
      adresse1: 'adresse',
      adresse2: '',
      codePostaux: ['12345'],
      commune: 'MARSEILLE',
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
      typeInstallationsAgrivoltaiques: undefined,
      élémentsSousOmbrière: undefined,
      typologieDeBâtiment: undefined,
      obligationDeSolarisation: undefined,
      puissanceDeSite: undefined,
      actionnariat: 'gouvernance-partagée',
      autorisationDUrbanisme: undefined,
    };
    expect(result.data).to.deep.equal(expected);
  });

  test('Cas nominal, classé', () => {
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
      puissanceProductionAnnuelle: 1,
      prixReference: 1,
      noteTotale: 1,
      nomReprésentantLégal: 'valentin cognito',
      emailContact: 'porteur@test.com',
      adresse1: 'adresse',
      adresse2: '',
      codePostaux: ['12345'],
      commune: 'MARSEILLE',
      statut: 'classé',
      motifÉlimination: undefined,
      puissanceALaPointe: false,
      evaluationCarboneSimplifiée: 0,
      technologie: 'N/A',
      typeGarantiesFinancières: 'avec-date-échéance',
      dateÉchéanceGf: '2024-12-01T00:00:00.000Z',
      historiqueAbandon: 'première-candidature',
      territoireProjet: '',
      coefficientKChoisi: undefined,
      typeInstallationsAgrivoltaiques: undefined,
      élémentsSousOmbrière: undefined,
      typologieDeBâtiment: undefined,
      obligationDeSolarisation: undefined,
      puissanceDeSite: undefined,
      actionnariat: 'gouvernance-partagée',
      autorisationDUrbanisme: undefined,
    };
    expect(result.data).to.deep.equal(expected);
  });

  test('Champs optionnels, spécifiques à certains AOs', () => {
    const result = candidatureCsvSchema.safeParse({
      ...minimumValuesClassé,
      'Technologie\n(dispositif de production)': 'Eolien',
      'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': 'Oui',
      'Installations agrivoltaïques': 'Jachère de plus de 5 ans',
      'Eléments sous l’ombrière': '...',
      'Typologie de bâtiment': 'Bâtiment existant avec rénovation de toiture',
      'Obligation de solarisation': 'Oui',
      "Date d'obtention de l'autorisation d'urbanisme": '21/08/2025',
      "Numéro de l'autorisation d'urbanisme": '123',
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
      puissanceProductionAnnuelle: 1,
      prixReference: 1,
      noteTotale: 1,
      nomReprésentantLégal: 'valentin cognito',
      emailContact: 'porteur@test.com',
      adresse1: 'adresse',
      adresse2: '',
      codePostaux: ['12345'],
      commune: 'MARSEILLE',
      statut: 'classé',
      motifÉlimination: undefined,
      puissanceALaPointe: true,
      evaluationCarboneSimplifiée: 0,
      technologie: 'eolien',
      typeGarantiesFinancières: 'avec-date-échéance',
      dateÉchéanceGf: '2024-12-01T00:00:00.000Z',
      historiqueAbandon: 'première-candidature',
      territoireProjet: '',
      coefficientKChoisi: undefined,
      typeInstallationsAgrivoltaiques: 'jachère-plus-de-5-ans',
      élémentsSousOmbrière: '...',
      typologieDeBâtiment: 'existant-avec-rénovation-de-toiture',
      obligationDeSolarisation: true,
      puissanceDeSite: undefined,
      actionnariat: 'gouvernance-partagée',
      autorisationDUrbanisme: { date: '2025-08-21T00:00:00.000Z', numéro: '123' },
    };
    expect(result.data).to.deep.equal(expected);
  });

  describe('Erreurs courantes', () => {
    test('chaîne de caractères obligatoire sans valeur', () => {
      const result = candidatureCsvSchema.safeParse({});
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ["Appel d'offres"],
        message: 'Required',
      });
    });

    test('chaîne de caractères obligatoire avec valeur vide', () => {
      const result = candidatureCsvSchema.safeParse({
        "Appel d'offres": '',
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        code: 'too_small',
        minimum: 1,
        type: 'string',
        inclusive: true,
        exact: false,
        path: ["Appel d'offres"],
        message: 'String must contain at least 1 character(s)',
      });
    });

    test('chaîne de caractères obligatoire avec espaces', () => {
      const result = candidatureCsvSchema.safeParse({
        "Appel d'offres": ' ',
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        code: 'too_small',
        minimum: 1,
        type: 'string',
        inclusive: true,
        exact: false,
        path: ["Appel d'offres"],
        message: 'String must contain at least 1 character(s)',
      });
    });

    test('nombre avec caractères', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        puissance_production_annuelle: 'abcd',
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        code: 'invalid_type',
        expected: 'number',
        received: 'nan',
        path: ['puissance_production_annuelle'],
        message: 'Expected number, received nan',
      });
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

      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        code: 'invalid_type',
        expected: 'number',
        received: 'undefined',
        path: ['puissance_production_annuelle'],
        message: 'Required',
      });
    });

    test('nombre strictement positif vaut 0', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        puissance_production_annuelle: '0',
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        code: 'too_small',
        minimum: 0,
        type: 'number',
        inclusive: false,
        exact: false,
        message: 'Le champ doit être un nombre positif',
        path: ['puissance_production_annuelle'],
      });
    });

    test('nombre strictement positif avec valeur négative', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        puissance_production_annuelle: 0,
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['puissance_production_annuelle'],
        message: 'Expected string, received number',
      });
    });

    test('oui/non valeur manquante', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        'Gouvernance partagée (Oui/Non)': '',
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        received: '',
        code: 'invalid_enum_value',
        options: ['oui', 'non'],
        path: ['Gouvernance partagée (Oui/Non)'],
        message: "Invalid enum value. Expected 'oui' | 'non', received ''",
      });
    });

    test('oui/non avec valeur invalide', () => {
      const result = candidatureCsvSchema.safeParse({
        ...minimumValuesEliminé,
        'Gouvernance partagée (Oui/Non)': 'peut-être',
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        received: 'peut-être',
        code: 'invalid_enum_value',
        options: ['oui', 'non'],
        path: ['Gouvernance partagée (Oui/Non)'],
        message: "Invalid enum value. Expected 'oui' | 'non', received 'peut-être'",
      });
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
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        received: 'wrong',
        code: 'invalid_enum_value',
        options: ['eliminé', 'éliminé', 'classé', 'retenu'],
        path: ['Classé ?'],
        message:
          "Invalid enum value. Expected 'eliminé' | 'éliminé' | 'classé' | 'retenu', received 'wrong'",
      });
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
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        validation: 'email',
        code: 'invalid_string',
        message: 'Invalid email',
        path: ['Adresse électronique du contact'],
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
      expect(result.error.errors[0]).to.deep.eq({
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
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
      expect(result.error.errors[0]).to.deep.eq({
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
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
      expect(result.error.errors[0]).to.deep.eq({
        received: 'string',
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
      expect(result.error.errors[0]).to.deep.eq({
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
      expect(result.error.errors[0]).to.deep.eq({
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
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
        expect(result.error.errors[0]).to.deep.eq({
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
        expect(result.error.errors[0]).to.deep.eq({
          code: 'too_small',
          minimum: 1,
          type: 'string',
          inclusive: true,
          exact: false,
          path: ['CP'],
          message: 'String must contain at least 1 character(s)',
        });
        expect(result.error.errors[1]).to.deep.eq({
          code: 'custom',
          path: ['CP'],
          message: 'Le code postal ne correspond à aucune région / département',
        });
      });
    });
    describe('Adresse', () => {
      test('au minimum un champs doit être spécifié', () => {
        const result = candidatureCsvSchema.safeParse({
          ...minimumValuesClassé,
          'N°, voie, lieu-dit 1': undefined,
        });
        assert(!result.success, 'should be error');
        expect(result.error.errors[0]).to.deep.eq({
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
  });
});
