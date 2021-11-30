import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectImported } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(ProjectImported, async ({ payload: { projectId } }) => {
  await ProjectEvent.create({ id: new UniqueEntityID().toString(), projectId, type: 'creation' })
})
