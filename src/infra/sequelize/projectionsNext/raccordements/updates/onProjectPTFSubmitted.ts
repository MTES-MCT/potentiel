import { ProjectPTFSubmitted } from '@modules/project'
import { Raccordements, RaccordementsProjector } from '../raccordements.model'

export default RaccordementsProjector.on(ProjectPTFSubmitted, async (évènement, transaction) => {
  const {
    payload: { projectId, fileId, submittedBy, ptfDate },
  } = évènement

  const raccordement = await Raccordements.findOne({ where: { projetId: projectId }, transaction })

  await Raccordements.update(
    {
      ptfFichierId: fileId,
      ptfDateDeSignature: ptfDate,
      ptfEnvoyéePar: submittedBy,
    },
    { where: { projetId: projectId }, transaction }
  )
})
