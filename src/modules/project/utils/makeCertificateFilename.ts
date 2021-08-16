import sanitize from 'sanitize-filename'

export const makeCertificateFilename = (
  project: {
    email: string
    nomProjet: string
    appelOffreId: string
    periodeId: string
    familleId: string | undefined
    numeroCRE: string
    id: string
    potentielIdentifier: string
  },
  forAdmin?: true
) => {
  return sanitize(
    project.potentielIdentifier + '-' + (forAdmin ? project.email : project.nomProjet) + '.pdf'
  )
}
