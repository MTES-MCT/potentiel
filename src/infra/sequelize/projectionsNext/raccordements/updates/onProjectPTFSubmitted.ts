import { ProjectPTFSubmitted } from '@modules/project'
import { Raccordements, RaccordementsProjector } from '../raccordements.model'
import { UniqueEntityID } from '@core/domain'

export default RaccordementsProjector.on(ProjectPTFSubmitted, async (évènement, transaction) => {
  const {
    payload: { projectId, fileId, submittedBy, ptfDate },
  } = évènement

  await Raccordements.create(
    {
      id: new UniqueEntityID().toString(),
      projetId: projectId,
      fichierId: fileId,
      dateEnvoi: ptfDate,
      envoyéesPar: submittedBy,
    },
    { transaction }
  )
})
