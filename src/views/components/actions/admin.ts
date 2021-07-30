import ROUTES from '../../../routes'

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

  if (project.notifiedOn) {
    actions.push({
      title: 'Voir attestation',
      link: ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS(project),
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

  const { attestationDesignationProof } = project

  if (attestationDesignationProof)
    actions.push({
      title: "Voir l'attestation de désignation fournie par le candidat",
      link: ROUTES.DOWNLOAD_PROJECT_FILE(
        attestationDesignationProof.file.id,
        attestationDesignationProof.file.filename
      ),
      isDownload: true,
    })

  return actions
}

export { adminActions }
