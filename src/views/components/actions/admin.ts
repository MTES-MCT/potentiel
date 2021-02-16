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
  return actions
}

export { adminActions }
