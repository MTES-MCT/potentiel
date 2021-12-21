import sanitize from 'sanitize-filename'

export const makeCertificateFilename = (
  projectData: {
    potentielIdentifier: string
  } & (
    | {
        forAdmin: true
        email: string
      }
    | { forAdmin: false; nomProjet: string }
  )
) => {
  return sanitize(
    projectData.potentielIdentifier +
      '-' +
      (projectData.forAdmin ? projectData.email : projectData.nomProjet) +
      '.pdf'
  )
}
