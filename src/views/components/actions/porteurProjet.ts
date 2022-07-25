import { ProjectAppelOffre } from '@entities/appelOffre'
import ROUTES from '@routes'

const porteurProjetActions = (project: {
  id: string
  appelOffre: ProjectAppelOffre
  isClasse: boolean
  isAbandoned: boolean
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
}) => {
  const canDownloadCertificate = !!project.certificateFile
  const isEolien = project.appelOffre.type === 'eolien'

  if (project.isAbandoned) return []

  if (!project.isClasse) {
    const actions: any[] = []

    if (project.certificateFile) {
      actions.push({
        title: 'Télécharger mon attestation',
        link: ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
          id: project.id,
          certificateFileId: project.certificateFile.id,
          nomProjet: project.nomProjet,
          potentielIdentifier: project.potentielIdentifier,
        }),
        isDownload: true,
        disabled: !canDownloadCertificate,
      })
    }

    actions.push({
      title: 'Faire une demande de recours',
      link: ROUTES.DEPOSER_RECOURS(project.id),
    })

    return actions
  }

  const actions: any[] = []

  if (project.certificateFile) {
    actions.push({
      title: 'Télécharger mon attestation',
      link: ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
        id: project.id,
        certificateFileId: project.certificateFile.id,
        nomProjet: project.nomProjet,
        potentielIdentifier: project.potentielIdentifier,
      }),
      isDownload: true,
      disabled: !canDownloadCertificate,
    })
  }
  actions.push(
    ...[
      {
        title: 'Télécharger le récapitulatif',
        link: '#',
        disabled: true,
      },
      {
        title: 'Demander un délai',
        link: ROUTES.DEMANDER_DELAI(project.id),
      },
      ...(!isEolien
        ? [
            {
              title: 'Changer de producteur',
              link: ROUTES.CHANGER_PRODUCTEUR(project.id),
            },
          ]
        : []),
      {
        title: 'Changer de fournisseur',
        link: ROUTES.CHANGER_FOURNISSEUR(project.id),
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
  )

  return actions
}

export { porteurProjetActions }
