import { ProjectCertificateGenerated } from '../../../../modules/project/events'

export const onProjectCertificateGenerated = (models) => async (
  event: ProjectCertificateGenerated
) => {
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

  if (!projectInstance) {
    console.log(
      'Error: onProjectCertificateGenerated projection failed to retrieve project from db',
      event
    )
    return
  }

  // update certificateFileId
  projectInstance.certificateFileId = event.payload.certificateFileId

  try {
    await projectInstance.save()
    // console.log(' onProjectCertificateGenerated Done saving')
  } catch (e) {
    console.log(
      'Error: onProjectCertificateGenerated projection failed to update project',
      event,
      e.message
    )
  }
}
