import { GarantiesFinancièresEvent } from '@infra/sequelize/projectionsNext/projectEvents/events/GarantiesFinancièresEvent'
import { getGarantiesFinancièresEvent } from './getGarantiesFinancièresEvent'
import { User } from '@entities'

describe('getGarantiesFinancièresEvent', () => {
  it(`Dans le cas d'un projet non soumis aux GF, 
      l'évènement de frise de garantie financière n'est pas retourné`, () => {
    const garantiesFinancières = getGarantiesFinancièresEvent({
      garantiesFinancièresEvent: { type: 'GarantiesFinancières' } as GarantiesFinancièresEvent,
      isSoumisAuxGF: false,
      isGarantiesFinancieresDeposeesALaCandidature: false,
      projectStatus: 'Classé',
      user: { role: 'porteur-projet' } as User,
      now: new Date('01-01-2020').getTime(),
    })
    expect(garantiesFinancières).toBeUndefined()
  })

  it(`Dans le cas d'un projet éliminé, 
      l'évènement de frise de garantie financière n'est pas retourné`, () => {
    const garantiesFinancières = getGarantiesFinancièresEvent({
      garantiesFinancièresEvent: { type: 'GarantiesFinancières' } as GarantiesFinancièresEvent,
      isSoumisAuxGF: true,
      isGarantiesFinancieresDeposeesALaCandidature: false,
      projectStatus: 'Eliminé',
      user: { role: 'porteur-projet' } as User,
      now: new Date('01-01-2020').getTime(),
    })
    expect(garantiesFinancières).toBeUndefined()
  })

  it(`Lorsqu'il n'y a pas d'évènement de type "garantiesFinancières" dans la projection ProjectEvents, 
      l'évènement de frise de garantie financière n'est pas retourné`, () => {
    const garantiesFinancières = getGarantiesFinancièresEvent({
      isSoumisAuxGF: true,
      isGarantiesFinancieresDeposeesALaCandidature: false,
      projectStatus: 'Classé',
      user: { role: 'porteur-projet' } as User,
      now: new Date('01-01-2020').getTime(),
    })
    expect(garantiesFinancières).toBeUndefined()
  })

  it(`Lorsqu'il n'y a pas d'évènement de type "garantiesFinancières" dans la projection ProjectEvents
      que le projet n'est pas abandonné et que les GF sont déposées à la candidature
      et que le projet est soumis aux GF,
      l'évènement de frise de garantie financière est retourné avec statut 'submitted-with-application'`, () => {
    const garantiesFinancières = getGarantiesFinancièresEvent({
      isSoumisAuxGF: true,
      isGarantiesFinancieresDeposeesALaCandidature: true,
      projectStatus: 'Classé',
      user: { role: 'porteur-projet' } as User,
      now: new Date('01-01-2020').getTime(),
    })
    expect(garantiesFinancières).toMatchObject({
      type: 'garanties-financieres',
      statut: 'submitted-with-application',
      date: 0,
    })
  })

  it(`Lorsqu'il y a un évènement de type "garantiesFinancières" dans la projection ProjectEvents
      l'évènement de frise de garantie financière est retourné avec statut associé`, () => {
    const dateLimiteDEnvoi = new Date('01-01-2022').getTime()
    const garantiesFinancières = getGarantiesFinancièresEvent({
      garantiesFinancièresEvent: {
        type: 'GarantiesFinancières',
        payload: { statut: 'due', dateLimiteDEnvoi },
      } as GarantiesFinancièresEvent,
      isSoumisAuxGF: true,
      isGarantiesFinancieresDeposeesALaCandidature: true,
      projectStatus: 'Classé',
      user: { role: 'porteur-projet' } as User,
      now: new Date('01-01-2020').getTime(),
    })
    expect(garantiesFinancières).toMatchObject({
      type: 'garanties-financieres',
      statut: 'due',
      date: dateLimiteDEnvoi,
    })
  })
})
