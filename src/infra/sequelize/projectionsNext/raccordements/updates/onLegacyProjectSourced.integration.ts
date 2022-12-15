import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '@infra/sequelize/helpers'
import { models } from '../../../models'
import { LegacyProjectSourced } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { Raccordements } from '../raccordements.model'
import onLegacyProjectSourced from './onLegacyProjectSourced'

describe(`handler onLegacyProjectSourced pour la projection raccordements`, () => {
  beforeEach(async () => await resetDatabase())
  const projetId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')

  const { Project } = models

  it(`Etant donné un événement LegacyProjectSourced émis pour un projet,
      alors une entrée est ajoutée dans la projection raccordements`, async () => {
    const projet = makeFakeProject({ id: projetId, classe: 'Classé' })
    await Project.create(projet)

    const évènement = new LegacyProjectSourced({
      payload: {
        projectId: projetId,
      } as LegacyProjectSourced['payload'],
      original: {
        version: 1,
        occurredAt,
      },
    })

    await onLegacyProjectSourced(évènement)

    const raccordement = await Raccordements.findOne({ where: { projetId } })
    expect(raccordement).not.toBeNull()
  })
})
