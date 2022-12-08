import { transformerISOStringEnDate } from './transformerISOStringEnDate'

describe('Fonction helper transformerISOStringEnDate', () => {
  it(`Lorsque la valeur est undefined ou null
      Alors le payload retourné doit être undefined ou null`, () => {
    const résultat = transformerISOStringEnDate(undefined)
    const résultat2 = transformerISOStringEnDate(null)
    expect(résultat).toEqual(undefined)
    expect(résultat2).toEqual(null)
  })

  it(`Lorsque la valeur n'est pas une chaîne de caractères ou que celle-ci n'est pas une date au format ISOString
      Alors le payload retourné doit contenir la valeur initiale non formattée`, () => {
    const résultat = transformerISOStringEnDate({
      test: 1,
      test2: [{ subTest1: true }],
      test3: false,
      test4: {
        subTest2: 'hello',
      },
    })
    expect(résultat).toMatchObject({
      test: 1,
      test2: [{ subTest1: true }],
      test3: false,
      test4: {
        subTest2: 'hello',
      },
    })
  })

  it(`Lorsque la valeur est une date au format ISOString
      Alors le payload retourné doit contenir la valeur au format Date`, () => {
    const date = '2022-09-28T22:00:00.000Z'
    const résultat = transformerISOStringEnDate({
      date,
      ensembleDeDatesArray: [date, date, date],
      ensembleDeDatesObject: {
        date,
      },
      test: [
        {
          id: '2',
          date,
        },
      ],
    })

    expect(résultat).toMatchObject({
      date: new Date(date),
      ensembleDeDatesArray: [new Date(date), new Date(date), new Date(date)],
      ensembleDeDatesObject: {
        date: new Date(date),
      },
      test: [
        {
          id: '2',
          date: new Date(date),
        },
      ],
    })
  })
})
