import { ResultAsync } from '@core/utils'
import { CertificateTemplate } from '@entities'
import { ProjectDataForCertificate, IllegalProjectStateError } from '@modules/project'
import { OtherError } from '@modules/shared'
import { makeCertificate as makeCre4V0Certificate } from './cre4.v0'
import { makeCertificate as makeCre4V1Certificate } from './cre4.v1'
import { makeCertificate as makePpe2V1Certificate } from './ppe2'

/* global NodeJS */
export const buildCertificate = (args: {
  template: CertificateTemplate
  data: ProjectDataForCertificate
}): ResultAsync<NodeJS.ReadableStream, IllegalProjectStateError | OtherError> => {
  const { template, data } = args
  switch (template) {
    case 'cre4.v0':
      return makeCre4V0Certificate(data)
    case 'cre4.v1':
      return makeCre4V1Certificate(data)
    case 'ppe2.v1':
      return makePpe2V1Certificate(data)
  }
}
