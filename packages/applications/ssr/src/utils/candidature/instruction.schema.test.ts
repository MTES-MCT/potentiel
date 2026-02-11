import { test, describe } from 'node:test';

import '../zod/setupLocale';

import { assert, expect } from 'chai';

import { instructionSchema, InstructionSchemaShape } from '.';

import { assertError, assertNoError, deepEqualWithRichDiff } from './csv/_test-shared';

const minimumValuesÉliminé: Partial<Record<keyof InstructionSchemaShape, string>> = {
  statut: 'éliminé',
  motifÉlimination: "un motif d'élimination",
  noteTotale: '1',
};

const minimumValuesClassé: Partial<Record<keyof InstructionSchemaShape, string>> = {
  statut: 'classé',
  motifÉlimination: undefined,
  noteTotale: '1',
};

describe('Schema instruction', () => {
  describe('Cas nominaux', () => {
    test('Cas nominal : éliminé', () => {
      const result = instructionSchema.safeParse(minimumValuesÉliminé);

      assertNoError(result);
      const expected = {
        statut: 'éliminé',
        motifÉlimination: "un motif d'élimination",
        noteTotale: 1,
      };
      deepEqualWithRichDiff(result.data, expected);
    });

    test('Cas nominal : classé', () => {
      const result = instructionSchema.safeParse(minimumValuesClassé);
      assertNoError(result);
      const expected = {
        statut: 'classé',
        motifÉlimination: undefined,
        noteTotale: 1,
      };
      deepEqualWithRichDiff(result.data, expected);
    });
  });
  describe('Erreurs courantes', () => {
    test('Statut invalide', () => {
      const result = instructionSchema.safeParse({
        ...minimumValuesÉliminé,
        statut: 'invalide',
      });
      assert(!result.success, 'should be error');
      assertError(
        result,
        ['statut'],
        'Option invalide : une valeur parmi "éliminé"|"classé" attendue',
      );
    });
    test('Note totale invalide', () => {
      const result = instructionSchema.safeParse({
        ...minimumValuesÉliminé,
        noteTotale: 'invalid',
      });
      assert(!result.success, 'should be error');
      assertError(result, ['noteTotale'], 'Le champ doit être un nombre');
    });
    test("Éliminé sans motif d'élimination", () => {
      const result = instructionSchema.safeParse({
        ...minimumValuesÉliminé,
        motifÉlimination: undefined,
      });
      assert(!result.success, 'should be error');
      console.log(result.error.issues);
      expect(result.error.issues[0]).to.deep.eq({
        code: 'custom',
        path: ['motifÉlimination'],
        message: 'motifÉlimination est requis lorsque le statut a la valeur "éliminé"',
      });
    });
    test("Classé avec motif d'élimination", () => {
      const result = instructionSchema.safeParse({
        ...minimumValuesClassé,
        motifÉlimination: "un motif d'élimination",
      });
      assert(!result.success, 'should be error');
      expect(result.error.issues[0]).to.deep.eq({
        code: 'custom',
        path: ['motifÉlimination'],
        message: "Un motif d'élimination ne devrait pas être renseigné pour un candidat classé",
      });
    });
  });
});
