import { ValidationError } from 'yup'
import { CsvValidationError } from './errors'
import { mapYupValidationErrorToCsvValidationError } from './mapYupValidationErrorToCsvValidationError'

describe(`mapper une ValidationError yup vers une erreur de type CsvValidationError`, () => {
  describe(`Cas d'une ValidationError ne contenant pas de sous erreurs (inner)`, () => {
    it(`Lorsqu'on mappe une ValidationError sans sous-erreurs
        Alors on devrait récupérer une CsvValidationError sans détails d'erreurs ([])
    `, () => {
      expect(mapYupValidationErrorToCsvValidationError(new ValidationError(''))).toStrictEqual(
        new CsvValidationError({ validationErreurs: [] })
      )

      const erreur = {
        value: 'erreurValue',
        errors: ["description de l'erreur"],
        name: 'nom',
        message: 'message',
      } as ValidationError

      expect(mapYupValidationErrorToCsvValidationError(new ValidationError(erreur))).toStrictEqual(
        new CsvValidationError({ validationErreurs: [] })
      )

      const erreurs = [erreur, erreur, erreur]

      expect(mapYupValidationErrorToCsvValidationError(new ValidationError(erreurs))).toStrictEqual(
        new CsvValidationError({ validationErreurs: [] })
      )
    })
  })

  describe(`Cas d'une ValidationError contenant une erreur`, () => {
    it(`Alors on devrait récupérer une CsvValidationError avec un détail d'erreurs`, () => {
      const erreur = {
        inner: [
          {
            path: '[0].column',
            params: {
              originalValue: 'originalValue1',
            },
            errors: ['Le champ est incorrect car X'],
          },
          {
            path: '[1].column2',
            errors: ['Le champ est manquant'],
          },
          {
            params: {
              originalValue: 'originalValue2',
            },
            errors: ['Une erreur est survenue'],
          },
          {
            params: {
              originalValue: 1,
            },
            errors: ['Une erreur est survenue'],
          },
        ],
      } as ValidationError

      expect(mapYupValidationErrorToCsvValidationError(new ValidationError(erreur))).toStrictEqual(
        new CsvValidationError({
          validationErreurs: [
            {
              numéroLigne: 2,
              valeur: 'originalValue1',
              erreur: 'Le champ est incorrect car X',
            },
            {
              numéroLigne: 3,
              erreur: 'Le champ est manquant',
            },
            {
              valeur: 'originalValue2',
              erreur: 'Une erreur est survenue',
            },
            {
              valeur: undefined,
              erreur: 'Une erreur est survenue',
            },
          ],
        })
      )
    })
  })
})
