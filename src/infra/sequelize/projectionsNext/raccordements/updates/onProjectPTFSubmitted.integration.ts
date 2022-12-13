import { UniqueEntityID } from '@core/domain'
import { ProjectPTFSubmitted } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { Raccordements } from '../raccordements.model'
import onProjectPTFSubmitted from './onProjectPTFSubmitted'

describe('Raccordements.onProjectPTFSubmitted', () => {
  const projetId = new UniqueEntityID().toString()
  const submittedBy = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const ptfDate = new Date('12-01-2020')

  beforeEach(async () => await resetDatabase())

  it(`Etant donné un projet avec une entrée dans la projection raccordements,
        Lorsque l'event ProjectPTFRemoved survient, 
        Alors les champs associés à la ptf doivent être définit aux valeurs de l'évènements`, async () => {
    await Raccordements.create({
      id: new UniqueEntityID().toString(),
      projetId,
    })

    await onProjectPTFSubmitted(
      new ProjectPTFSubmitted({ payload: { projectId: projetId, fileId, ptfDate, submittedBy } })
    )

    expect(await Raccordements.findOne({ where: { projetId } })).toMatchObject({
      ptfDateDeSignature: ptfDate,
      ptfEnvoyéePar: submittedBy,
      ptfFichierId: fileId,
    })
  })
})
