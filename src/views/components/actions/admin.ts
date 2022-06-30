import ROUTES from '@routes'

const adminActions = (project: {
  id: string
  certificateFile?: {
    id: string
    filename: string
  }
  notifiedOn: Date | null
  appelOffreId: string
  periodeId: string
  familleId: string | undefined
  numeroCRE: string
  email: string
  nomProjet: string
  potentielIdentifier: string
  attestationDesignationProof: { file: { id: string; filename: string } }
}) => {
  const canDownloadCertificate = !!project.certificateFile

  const actions: any = []

  if (project.notifiedOn && project.certificateFile) {
    actions.push({
      title: 'Voir attestation',
      link: ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS({
        id: project.id,
        certificateFileId: project.certificateFile.id,
        email: project.email,
        potentielIdentifier: project.potentielIdentifier,
      }),
      isDownload: true,
      disabled: !canDownloadCertificate,
    })
  } else {
    actions.push({
      title: 'Aperçu attestation',
      link: ROUTES.PREVIEW_CANDIDATE_CERTIFICATE(project),
      isDownload: true,
    })
  }

  return actions
}

export { adminActions }
