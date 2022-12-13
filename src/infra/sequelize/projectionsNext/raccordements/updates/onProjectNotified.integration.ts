import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '@infra/sequelize/helpers'
import { models } from '../../../models'
import { ProjectNotified } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import onProjectNotified from './onProjectNotified'
import { Raccordements } from '../raccordements.model'

describe(`handler onProjectNotified pour la projection raccordements`, () => {
  beforeEach(async () => await resetDatabase())
  const projetId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')

  const { Project } = models

  it(`Etant donné un événement ProjectNotified émis pour un projet,
      alors une entrée est ajoutée dans la projection raccordements`, async () => {
    const projet = makeFakeProject({ id: projetId, classe: 'Classé' })
    await Project.create(projet)

    const évènement = new ProjectNotified({
      payload: {
        projectId: projetId,
        candidateEmail: 'candidat@test.test',
        candidateName: 'nom candidat',
        periodeId: '1',
        appelOffreId: 'PPE2 - Eolien',
        notifiedOn: 123,
      },
      original: {
        version: 1,
        occurredAt,
      },
    })

    await onProjectNotified(évènement)

    const raccordement = await Raccordements.findOne({ where: { projetId } })
    expect(raccordement).not.toBeNull()
  })
})
