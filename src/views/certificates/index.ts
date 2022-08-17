import { ResultAsync } from '@core/utils'
import { CertificateTemplate, User } from '@entities'
import { ProjectDataForCertificate, IllegalProjectStateError } from '@modules/project'
import { OtherError } from '@modules/shared'
import { makeCertificate as makeCre4V0Certificate } from './cre4.v0'
import { makeCertificate as makeCre4V1Certificate } from './cre4.v1'
import { makeCertificate as makePpe2V1Certificate } from './ppe2.v1'
import { makeCertificate as makePpe2V2Certificate } from './ppe2.v2'

export type Signataire = { fullName: string; fonction: string }

export const buildCertificate = (args: {
  template: CertificateTemplate
  data: ProjectDataForCertificate
  validateur?: User | null
  prévisualisation?: true
}): ResultAsync<NodeJS.ReadableStream, IllegalProjectStateError | OtherError> => {
  const { template, data, validateur, prévisualisation } = args

  const prévisualisationSignataire: Signataire = {
    fullName: '[Nom du signataire]',
    fonction: '[Intitulé de la fonction du signataire]',
  }

  const signataire: Signataire = prévisualisation
    ? prévisualisationSignataire
    : validateur
    ? { fullName: validateur.fullName, fonction: validateur.fonction }
    : {
        fullName: 'Ghislain Ferran',
        fonction: `L’adjoint au sous-directeur du système électrique et des énergies renouvelables`,
      }

  const signatairePPE2v2: Signataire = prévisualisation
    ? prévisualisationSignataire
    : validateur
    ? { fullName: validateur.fullName, fonction: validateur.fonction }
    : {
        fullName: 'Nicolas CLAUSSET',
        fonction: `Le sous-directeur du système électrique et des énergies renouvelables`,
      }

  switch (template) {
    case 'cre4.v0':
      return makeCre4V0Certificate(data, signataire)
    case 'cre4.v1':
      return makeCre4V1Certificate(data, signataire)
    case 'ppe2.v1':
      return makePpe2V1Certificate(data, signataire)
    case 'ppe2.v2':
      return makePpe2V2Certificate(data, signatairePPE2v2)
  }
}
