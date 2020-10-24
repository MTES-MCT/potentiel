import { errAsync, ResultAsync } from '../../core/utils'
import { CertificateTemplate, Project } from '../../entities'
import { makeCertificate as makeV0Certificate } from './v0'
import { makeCertificate as makeV1Certificate } from './v1'

/* global NodeJS */
export const buildCertificate = (
  template: CertificateTemplate,
  project: Project
): ResultAsync<NodeJS.ReadableStream, Error> => {
  switch (template) {
    case 'v0':
      return makeV0Certificate({ project })
    case 'v1':
      return makeV1Certificate({ project })
    default:
      return errAsync(new Error('Unknown template'))
  }
}
