import sanitize from 'sanitize-filename'

import { makeProjectIdentifier } from '../../../entities'

export const makeCertificateFilename = (
  project: {
    email: string
    nomProjet: string
    appelOffreId: string
    periodeId: string
    familleId: string | undefined
    numeroCRE: string
    id: string
  },
  forAdmin?: true
) => {
  return sanitize(
    makeProjectIdentifier(project) + '-' + (forAdmin ? project.email : project.nomProjet) + '.pdf'
  )
}
