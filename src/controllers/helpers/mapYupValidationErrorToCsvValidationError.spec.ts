import { ValidationError } from 'yup'
import { mapYupValidationErrorToCsvValidationError } from './mapYupValidationErrorToCsvValidationError'

describe(`mapper une ValidationError yup vers une erreur de type CsvValidationError`, () => {
  describe(`Cas d'une ValidationError ne contenant pas de sous erreurs (inner)`, () => {
    it(`Lorsqu'on mappe une ValidationError sans sous-erreurs
        Alors on devrait récupérer une CsvValidationError sans détails d'erreurs ([])
    `, () => {
      const csvValidationError1 = mapYupValidationErrorToCsvValidationError(new ValidationError(''))
      expect(csvValidationError1.détails).toHaveLength(0)

      const erreur = {
        value: 'erreurValue',
        errors: ["description de l'erreur"],
        name: 'nom',
        message: 'message',
        inner: [],
      } as ValidationError
      const csvValidationError2 = mapYupValidationErrorToCsvValidationError(
        new ValidationError(erreur)
      )

      expect(csvValidationError2.détails).toHaveLength(0)
    })
  })

  describe(`Cas d'une ValidationError contenant deux sous-erreurs dont l'une ne dispose pas de path`, () => {
    it(`Lorsqu'on mappe une ValidationError content deux sous-erreurs dont l'une ne dispose pas de path
        Alors on devrait récupérer une CsvValidation contenant une seule entrée dans validationErreurs`, () => {
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
            errors: ['le champ est incorrect car X'],
          },
        ],
      } as ValidationError

      const csvValidationErreur = mapYupValidationErrorToCsvValidationError(erreur)

      expect(csvValidationErreur.détails).toStrictEqual([
        {
          numéroLigne: 2,
          valeurInvalide: 'originalValue1',
          raison: 'le champ est incorrect car X',
        },
      ])
    })
  })

  describe(`Cas d'une ValidationError contenant deux sous-erreurs dont l'une ne dispose pas de originalValue`, () => {
    it(`Lorsqu'on mappe une ValidationError content deux sous-erreurs dont l'une ne dispose pas de originalValue
        Alors on devrait récupérer une CsvValidation contenant deux entrées dans validationErreurs dont une a une erreur qui précise que le champ est manquant`, () => {
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
      } as ValidationError

      const csvValidationErreur = mapYupValidationErrorToCsvValidationError(erreur)

      expect(csvValidationErreur.détails).toStrictEqual([
        {
          numéroLigne: 2,
          valeurInvalide: 'originalValue1',
          raison: 'le champ est incorrect car X',
        },
        {
          numéroLigne: 3,
          raison: 'le champ est manquant',
        },
      ])
    })
  })

  describe(`Cas d'une ValidationError contenant deux sous-erreurs dont l'une dispose d'une originalValue ayant un type autre que string`, () => {
    it(`Lorsqu'on mappe une ValidationError content deux sous-erreurs  dont l'une dispose d'une originalValue ayant un type autre que string
        Alors on devrait récupérer une CsvValidation contenant une seule entrée entrée dans validationErreurs`, () => {
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
      } as ValidationError

      const csvValidationErreur = mapYupValidationErrorToCsvValidationError(erreur)

      expect(csvValidationErreur.détails).toStrictEqual([
        {
          numéroLigne: 2,
          valeurInvalide: 'originalValue1',
          raison: 'le champ est incorrect car X',
        },
      ])
    })
  })

  describe(`Cas d'une ValidationError contenant deux sous-erreurs dont l'une ne dispose pas d'erreur retournée par yup`, () => {
    it(`Lorsqu'on mappe une ValidationError content deux sous-erreurs dont l'une ne dispose pas d'erreur retournée par yup
        Alors on devrait récupérer une CsvValidation contenant une seule entrée dans validationErreurs`, () => {
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
      } as ValidationError

      const csvValidationErreur = mapYupValidationErrorToCsvValidationError(erreur)

      expect(csvValidationErreur.détails).toStrictEqual([
        {
          numéroLigne: 2,
          valeurInvalide: 'originalValue1',
          raison: 'le champ est incorrect car X',
        },
      ])
    })
  })
})
