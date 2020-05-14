import { Project, AppelOffre } from '../../../entities'
import ROUTES from '../../../routes'

const porteurProjetActions = (project: Project) => {
  const canDownloadCertificate =
    project.appelOffre?.periode?.canGenerateCertificate

  if (project.classe === 'Eliminé') {
    return [
      {
        title: 'Télécharger mon attestation',
        link: ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES(project),
        isDownload: true,
        disabled: !canDownloadCertificate,
      },
      {
        title: 'Faire une demande de recours',
        link: ROUTES.DEPOSER_RECOURS(project.id),
      },
    ]
  }

  return [
    {
      title: 'Télécharger mon attestation',
      link: ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES(project),
      isDownload: true,
      disabled: !canDownloadCertificate,
    },
    {
      title: 'Télécharger le récapitulatif',
      disabled: true,
    },
    {
      title: 'Demander un délai',
      link: ROUTES.DEMANDE_DELAIS(project.id),
    },
    // {
    //   title: 'Changer de fournisseur',
    //   link: ROUTES.CHANGER_FOURNISSEUR(project.id),
    // },
    {
      title: 'Changer de producteur',
      link: ROUTES.CHANGER_PRODUCTEUR(project.id),
    },
    {
      title: "Changer d'actionnaire",
      link: ROUTES.CHANGER_ACTIONNAIRE(project.id),
    },
    {
      title: 'Changer de puissance',
      link: ROUTES.CHANGER_PUISSANCE(project.id),
    },
    {
      title: 'Demander un abandon',
      link: ROUTES.DEMANDER_ABANDON(project.id),
    },
  ]
}

export { porteurProjetActions }
