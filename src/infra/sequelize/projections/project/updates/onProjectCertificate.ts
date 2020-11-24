import {
  ProjectCertificateGenerated,
  ProjectCertificateRegenerated,
  ProjectCertificateUploaded,
} from '../../../../../modules/project/events'

export const onProjectCertificate = (models) => async (
  event: ProjectCertificateGenerated | ProjectCertificateUploaded | ProjectCertificateRegenerated
) => {
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

  if (!projectInstance) {
    console.log('Error: onProjectCertificate projection failed to retrieve project from db', event)
    return
  }

  // update certificateFileId
  projectInstance.certificateFileId = event.payload.certificateFileId

  try {
    await projectInstance.save()
  } catch (e) {
    console.log('Error: onProjectCertificate projection failed to update project', event, e.message)
  }
}
