import { ProjectPTFRemoved } from '@modules/project'
import { Raccordements, RaccordementsProjector } from '../raccordements.model'

export default RaccordementsProjector.on(ProjectPTFRemoved, async (évènement, transaction) => {
  const {
    payload: { projectId },
  } = évènement

  await Raccordements.destroy({ where: { projetId: projectId }, transaction })
})
