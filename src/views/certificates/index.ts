import { ResultAsync } from '@core/utils'
import { CertificateTemplate } from '@entities'
import { ProjectDataForCertificate, IllegalProjectStateError } from '@modules/project'
import { OtherError } from '@modules/shared'
import { makeCertificate as makeCre4V0Certificate } from './cre4.v0'
import { makeCertificate as makeCre4V1Certificate } from './cre4.v1'
import { makeCertificate as makePpe2V1Certificate } from './ppe2.v1'
import { makeCertificate as makePpe2V2Certificate } from './ppe2.v2'

export type Validateur = { fullName: string; fonction?: string }

export const buildCertificate = (args: {
  template: CertificateTemplate
  data: ProjectDataForCertificate
  validateur?: Validateur
  prévisualisation?: true
}): ResultAsync<NodeJS.ReadableStream, IllegalProjectStateError | OtherError> => {
  const { template, data, prévisualisation } = args

  const prévisualisationSignataire: Validateur = {
    fullName: '[Nom du signataire]',
    fonction: '[Intitulé de la fonction du signataire]',
  }

  const validateur: Validateur = prévisualisation
    ? prévisualisationSignataire
    : args.validateur ?? {
        fullName: 'Ghislain FERRAN',
        fonction: `L’adjoint au sous-directeur du système électrique et des énergies renouvelables`,
      }

  const validateurPPE2v2: Validateur = prévisualisation
    ? prévisualisationSignataire
    : args.validateur ?? {
        fullName: 'Nicolas CLAUSSET',
        fonction: `Le sous-directeur du système électrique et des énergies renouvelables`,
      }

  switch (template) {
    case 'cre4.v0':
      return makeCre4V0Certificate(data, validateur)
    case 'cre4.v1':
      return makeCre4V1Certificate(data, validateur)
    case 'ppe2.v1':
      return makePpe2V1Certificate(data, validateur)
    case 'ppe2.v2':
      return makePpe2V2Certificate(data, validateurPPE2v2)
  }
}
