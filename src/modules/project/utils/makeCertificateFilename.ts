import sanitize from 'sanitize-filename'

import { makeProjectIdentifier, Project } from '../../../entities'

export const makeCertificateFilename = (project: Project, forAdmin?: true) => {
  return sanitize(
    makeProjectIdentifier(project) + '-' + (forAdmin ? project.email : project.nomProjet) + '.pdf'
  )
}
