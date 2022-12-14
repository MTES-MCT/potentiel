import { UniqueEntityID } from '@core/domain'
import { ProjectPTFRemoved } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { Raccordements } from '../raccordements.model'
import onProjectPTFRemoved from './onProjectPTFRemoved'

describe('Raccordements.onProjectPTFRemoved', () => {
  const projetId = new UniqueEntityID().toString()
  const removedBy = new UniqueEntityID().toString()
  beforeEach(async () => await resetDatabase())

  it(`Etant donné un projet avec une entrée dans la projection raccordements,
        Lorsque l'event ProjectPTFRemoved survient, les champs associés à la ptf doivent être à null`, async () => {
    await Raccordements.create({
      id: new UniqueEntityID().toString(),
      projetId,
      ptfDateDeSignature: new Date(),
      ptfEnvoyéePar: 'user-id',
      ptfFichierId: 'fichier-id',
    })

    await onProjectPTFRemoved(
      new ProjectPTFRemoved({ payload: { projectId: projetId, removedBy } })
    )

    expect(await Raccordements.findOne({ where: { projetId } })).toMatchObject({
      ptfDateDeSignature: null,
      ptfEnvoyéePar: null,
      ptfFichierId: null,
    })
  })
})
