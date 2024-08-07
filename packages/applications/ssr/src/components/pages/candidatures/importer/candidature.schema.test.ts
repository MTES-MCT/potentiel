import { test, describe } from 'node:test';

import { expect, assert } from 'chai';
import { SafeParseReturnType } from 'zod';

import { CandidatureSchema, candidatureSchema } from './candidature.schema';

const minimumValues: Partial<Record<keyof CandidatureSchema, string>> = {
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
  'Classé ?': 'Eliminé',
  'Gouvernance partagée (Oui/Non)': 'Oui',
  'Financement collectif (Oui/Non)': 'Non',
  'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
    'N/A',
  'Technologie\n(dispositif de production)': 'N/A',
  "Motif d'élimination": 'motif',
  "1. Lauréat d'aucun AO\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'un AO":
    '1',
};

const assertNoError = (result: SafeParseReturnType<unknown, unknown>) => {
  if (!result.success) {
    expect(result.error).to.be.undefined;
  }
  assert(result.success);
};

describe('Schema candidature', () => {
  test('Cas nominal', () => {
    const result = candidatureSchema.safeParse({
      ...minimumValues,
    });
    assertNoError(result);
  });

  describe('Erreurs courantes', () => {
    test('chaîne de caractères obligatoire sans valeur', () => {
      const result = candidatureSchema.safeParse({});
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
      const result = candidatureSchema.safeParse({
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
      const result = candidatureSchema.safeParse({
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

    test('nombre avec charactères', () => {
      const result = candidatureSchema.safeParse({
        ...minimumValues,
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

    test('nombre strictement positif vaut 0', () => {
      const result = candidatureSchema.safeParse({
        ...minimumValues,
        puissance_production_annuelle: '0',
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        code: 'too_small',
        minimum: 0,
        type: 'number',
        inclusive: false,
        exact: false,
        message: 'Number must be greater than 0',
        path: ['puissance_production_annuelle'],
      });
    });

    test('nombre strictement positif avec valeur négative', () => {
      const result = candidatureSchema.safeParse({
        ...minimumValues,
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
      const result = candidatureSchema.safeParse({
        ...minimumValues,
        'Financement collectif (Oui/Non)': '',
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        received: '',
        code: 'invalid_enum_value',
        options: ['oui', 'non'],
        path: ['Financement collectif (Oui/Non)'],
        message: "Invalid enum value. Expected 'oui' | 'non', received ''",
      });
    });

    test('oui/non avec valeur invalide', () => {
      const result = candidatureSchema.safeParse({
        ...minimumValues,
        'Financement collectif (Oui/Non)': 'peut-être',
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        received: 'peut-être',
        code: 'invalid_enum_value',
        options: ['oui', 'non'],
        path: ['Financement collectif (Oui/Non)'],
        message: "Invalid enum value. Expected 'oui' | 'non', received 'peut-être'",
      });
    });

    test('Enum avec valeur invalide', () => {
      const result = candidatureSchema.safeParse({
        ...minimumValues,
        'Classé ?': 'wrong',
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        received: 'wrong',
        code: 'invalid_enum_value',
        options: ['Eliminé', 'Classé'],
        path: ['Classé ?'],
        message: "Invalid enum value. Expected 'Eliminé' | 'Classé', received 'wrong'",
      });
    });

    test('Email non valide', () => {
      const result = candidatureSchema.safeParse({
        ...minimumValues,
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
      const result = candidatureSchema.safeParse({
        ...minimumValues,
        'Classé ?': 'Classé',
        "Motif d'élimination": undefined,
        "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
          '1',
      });
      assertNoError(result);
    });

    test("Motif d'élimination est obligatoire si éliminé", () => {
      const result = candidatureSchema.safeParse({
        ...minimumValues,
        "Motif d'élimination": undefined,
      });
      assert(!result.success);
      expect(result.error.errors[0]).to.deep.eq({
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ["Motif d'élimination"],
        message: `"Motif d'élimination" est requis lorsque "Classé ?" a la valeur "Eliminé"`,
      });
    });

    test("Date d'échéance est obligatoire si GF avec date d'échéance", () => {
      const result = candidatureSchema.safeParse({
        ...minimumValues,
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
  });

  describe('Cas particuliers', () => {
    describe('Evaluation carbone', () => {
      test('accepte N/A', () => {
        const result = candidatureSchema.safeParse({
          ...minimumValues,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            'N/A',
        });
        assert(result.success);
      });

      test('accepte un nombre positif', () => {
        const result = candidatureSchema.safeParse({
          ...minimumValues,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '1',
        });
        assert(result.success);
      });

      test(`n'accepte pas un nombre négatif`, () => {
        const result = candidatureSchema.safeParse({
          ...minimumValues,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '-1',
        });
        assert(!result.success);
      });

      test(`n'accepte pas du texte`, () => {
        const result = candidatureSchema.safeParse({
          ...minimumValues,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            'abcd',
        });
        assert(!result.success);
      });
    });
  });
});
