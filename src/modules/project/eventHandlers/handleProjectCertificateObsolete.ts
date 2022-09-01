import { GenerateCertificate, ProjectCertificateObsolete } from '..'

export const handleProjectCertificateObsolete =
  (deps: { generateCertificate: GenerateCertificate }) =>
  async (event: ProjectCertificateObsolete) => {
    const { projectId } = event.payload

    await deps.generateCertificate({ projectId })
  }
