import { ResultAsync } from '../../core/utils'
import { CertificateTemplate } from '../../entities'
import { ProjectDataForCertificate } from '../../modules/project/dtos'
import { IllegalProjectStateError } from '../../modules/project/errors'
import { OtherError } from '../../modules/shared'
import { makeCertificate as makeV0Certificate } from './v0'
import { makeCertificate as makeV1Certificate } from './v1'

/* global NodeJS */
export const buildCertificate = (args: {
  template: CertificateTemplate
  data: ProjectDataForCertificate
}): ResultAsync<NodeJS.ReadableStream, IllegalProjectStateError | OtherError> => {
  const { template, data } = args
  switch (template) {
    case 'v0':
      return makeV0Certificate(data)
    case 'v1':
      return makeV1Certificate(data)
  }
}
