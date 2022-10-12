import { yupFormatCsvDataError } from './yupFormatCsvDataError'

describe(`Fonction helper yupFormatCsvDataError`, () => {
  describe(`Si la fonction est exécutée sans aucune erreur transmise`, () => {
    it(`Si aucun message personnalisé n'est précisé,
      Alors la fonction doit retourner le message par défault`, () => {
      expect(yupFormatCsvDataError(null)).toStrictEqual([
        'Une erreur est survenue lors de la validation des données',
      ])
    })
    it(`Si un message personnalisé est précisé,
      Alors la fonction doit retourner le message personnalisé`, () => {
      expect(yupFormatCsvDataError(null, 'erreur')).toStrictEqual(['erreur'])
    })
  })

  describe(`Si la fonction est exécutée avec une erreur`, () => {
    describe(`Si l'erreur est incomplète`, () => {
      it(`Si l'erreur ne dispose pas de détails
          Alors la fonction doit retourner le message par défaut`, () => {
        expect(yupFormatCsvDataError({})).toStrictEqual([
          'Une erreur est survenue lors de la validation des données',
        ])
        expect(yupFormatCsvDataError({ inner: [] })).toStrictEqual([
          'Une erreur est survenue lors de la validation des données',
        ])
      })
    })

    describe(`Si l'erreur est complète`, () => {
      it(`Alors la fonction doit retourner la ou les erreurs correctement formattée(s)`, () => {
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
          ],
        }

        expect(yupFormatCsvDataError(erreur)).toStrictEqual([
          'Ligne 2 - originalValue1 - Le champ est incorrect car X',
          'Ligne 3 - Le champ est manquant',
          'originalValue2 - Une erreur est survenue',
        ])
      })
    })
  })
})
