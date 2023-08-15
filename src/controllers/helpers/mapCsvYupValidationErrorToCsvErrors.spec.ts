import { describe, expect, it } from '@jest/globals';
import { ValidationError } from 'yup';
import { mapCsvYupValidationErrorToCsvErrors } from './mapCsvYupValidationErrorToCsvErrors';

describe(`récupérer les erreurs ligne par ligne depuis une ValidationError yup pour un fichier CSV`, () => {
  describe(`Cas d'une ValidationError ne contenant pas de sous erreurs (inner)`, () => {
    it(`Lorsqu'on mappe une ValidationError sans sous-erreurs
        Alors on ne devrait récupérer aucune erreur
    `, () => {
      const actual1 = mapCsvYupValidationErrorToCsvErrors(new ValidationError(''));
      expect(actual1).toEqual([]);

      const erreur = {
        value: 'erreurValue',
        errors: ["description de l'erreur"],
        name: 'nom',
        message: 'message',
        inner: [],
      } as ValidationError;
      const actual2 = mapCsvYupValidationErrorToCsvErrors(new ValidationError(erreur));

      expect(actual2).toEqual([]);
    });
  });

  describe(`Cas d'une ValidationError contenant deux sous-erreurs dont l'une ne dispose pas de path`, () => {
    it(`Lorsqu'on mappe une ValidationError content deux sous-erreurs dont l'une ne dispose pas de path
        Alors on devrait récupérer deux erreurs dont l'une ne dispose pas de numéroLigne`, () => {
      const erreur = {
        inner: [
          {
            path: '[0].column',
            errors: ['le champ est incorrect car X'],
            params: {
              originalValue: 'originalValue1',
            } as Record<string, unknown>,
          },
          {
            params: {
              originalValue: 'originalValue2',
            } as Record<string, unknown>,
            errors: ['le champ est incorrect car X'],
          },
        ],
      } as ValidationError;

      const actual = mapCsvYupValidationErrorToCsvErrors(erreur);

      expect(actual).toEqual([
        {
          numéroLigne: 2,
          valeurInvalide: 'originalValue1',
          raison: 'le champ est incorrect car X',
        },
        {
          valeurInvalide: 'originalValue2',
          raison: 'le champ est incorrect car X',
        },
      ]);
    });
  });

  describe(`Cas d'une ValidationError contenant deux sous-erreurs dont l'une ne dispose pas de originalValue`, () => {
    it(`Lorsqu'on mappe une ValidationError contenant deux sous-erreurs dont l'une ne dispose pas de originalValue
        Alors on devrait récupérer une deux erreurs dont une a une erreur qui précise que le champ est manquant`, () => {
      const erreur = {
        inner: [
          {
            path: '[0].column',
            errors: ['le champ est incorrect car X'],
            params: {
              originalValue: 'originalValue1',
            } as Record<string, unknown>,
          },
          {
            path: '[1].column',
            errors: ['le champ est manquant'],
          },
        ],
      } as ValidationError;

      const actual = mapCsvYupValidationErrorToCsvErrors(erreur);

      expect(actual).toEqual([
        {
          numéroLigne: 2,
          valeurInvalide: 'originalValue1',
          raison: 'le champ est incorrect car X',
        },
        {
          numéroLigne: 3,
          raison: 'le champ est manquant',
        },
      ]);
    });
  });

  describe(`Cas d'une ValidationError contenant deux sous-erreurs dont l'une dispose d'une originalValue ayant un type autre que string`, () => {
    it(`Lorsqu'on mappe une ValidationError content deux sous-erreurs dont l'une dispose d'une originalValue ayant un type autre que string
        Alors on devrait récupérer une seule erreur`, () => {
      const erreur = {
        inner: [
          {
            path: '[0].column',
            errors: ['le champ est incorrect car X'],
            params: {
              originalValue: 'originalValue1',
            } as Record<string, unknown>,
          },
          {
            path: '[1].column',
            errors: ['le champ est incorrect car Y'],
            params: {
              originalValue: 1,
            } as Record<string, unknown>,
          },
        ],
      } as ValidationError;

      const actual = mapCsvYupValidationErrorToCsvErrors(erreur);

      expect(actual).toEqual([
        {
          numéroLigne: 2,
          valeurInvalide: 'originalValue1',
          raison: 'le champ est incorrect car X',
        },
        {
          numéroLigne: 3,
          raison: 'le champ est incorrect car Y',
        },
      ]);
    });
  });

  describe(`Cas d'une ValidationError contenant deux sous-erreurs dont l'une ne dispose pas d'erreur retournée par yup`, () => {
    it(`Lorsqu'on mappe une ValidationError content deux sous-erreurs dont l'une ne dispose pas d'erreur retournée par yup
        Alors on devrait récupérer une seule erreur`, () => {
      const erreur = {
        inner: [
          {
            path: '[0].column',
            errors: ['le champ est incorrect car X'],
            params: {
              originalValue: 'originalValue1',
            } as Record<string, unknown>,
          },
          {
            path: '[1].column',
          },
        ],
      } as ValidationError;

      const actual = mapCsvYupValidationErrorToCsvErrors(erreur);

      expect(actual).toEqual([
        {
          numéroLigne: 2,
          valeurInvalide: 'originalValue1',
          raison: 'le champ est incorrect car X',
        },
      ]);
    });
  });
});
