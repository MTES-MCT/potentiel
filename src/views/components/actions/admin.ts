import { Project, AppelOffre } from '../../../entities'
import ROUTES from '../../../routes'

const adminActions = (project: Project, appelOffre?: AppelOffre) => {
  const periode = appelOffre?.periodes.find(
    (periode) => periode.id === project.periodeId
  )
  const canDownloadCertificate = periode && periode.canGenerateCertificate

  return [
    {
      title: 'Voir attestation',
      link: ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS(project),
      isDownload: true,
      disabled: !canDownloadCertificate,
    },
  ]
}

export { adminActions }
