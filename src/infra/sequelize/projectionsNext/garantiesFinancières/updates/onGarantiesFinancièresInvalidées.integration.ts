import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '@infra/sequelize/helpers'
import { GarantiesFinancièresInvalidées } from '@modules/project'
import { GarantiesFinancières } from '../garantiesFinancières.model'
import onGarantiesFinancièresInvalidées from './onGarantiesFinancièresInvalidées'

describe(`handler onGarantiesFinancièresInvalidées pour la projection garantiesFinancières`, () => {
  beforeEach(async () => {
    await resetDatabase()
  })
  const id = new UniqueEntityID().toString()
  const projetId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')
  const gfDate = new Date('2020-01-01')
  const fichierId = new UniqueEntityID().toString()
  const envoyéesPar = new UniqueEntityID().toString()
  const validéesPar = new UniqueEntityID().toString()
  const validéesLe = new Date('2020-01-01')
  const dateExpiration = new Date('2020-01-01')
  const dateLimiteEnvoi = new Date('2020-01-01')

  it(`Etant donné un projet existant dans la projection garantiesFinancières avec le statut 'validé',
      lorsqu'un événement GarantiesFinancièresInvalidées est émis pour ce projet,
      alors le statut devrait passer à 'à traiter' et les infos du contexte de validation (validéesLe, validéesPar) devrait passer à null. Le reste des données devrait être conservé`, async () => {
    await GarantiesFinancières.create({
      id,
      projetId,
      statut: 'validé',
      validéesPar,
      validéesLe,
      soumisesALaCandidature: true,
      envoyéesPar,
      dateEchéance: dateExpiration,
      dateEnvoi: occurredAt,
      dateConstitution: gfDate,
      fichierId,
      dateLimiteEnvoi,
    })

    await onGarantiesFinancièresInvalidées(
      new GarantiesFinancièresInvalidées({
        payload: {
          projetId,
          invalidéesPar: new UniqueEntityID().toString(),
        },
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const GF = await GarantiesFinancières.findOne({ where: { projetId } })

    expect(GF).toMatchObject({
      id,
      projetId,
      statut: 'à traiter',
      validéesPar: null,
      validéesLe: null,
      soumisesALaCandidature: true,
      envoyéesPar,
      dateEchéance: dateExpiration,
      dateEnvoi: occurredAt,
      dateConstitution: gfDate,
      fichierId,
    })
  })
})
