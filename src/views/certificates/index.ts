import { ResultAsync } from '../../core/utils';
import { ProjectDataForCertificate, IllegalProjectStateError } from '../../modules/project';
import { OtherError } from '../../modules/shared';
import { CertificateTemplate } from '@potentiel/domain-views';
import { makeCertificate as makeCre4V0Certificate } from './cre4.v0';
import { makeCertificate as makeCre4V1Certificate } from './cre4.v1';
import { makeCertificate as makePpe2V1Certificate } from './ppe2.v1';
import { makeCertificate as makePpe2V2Certificate } from './ppe2.v2';

export type Validateur = { fullName: string; fonction?: string | null };

export const buildCertificate = ({
  template,
  data,
  validateur,
}: {
  template: CertificateTemplate;
  data: ProjectDataForCertificate;
  validateur: Validateur;
}): ResultAsync<NodeJS.ReadableStream, IllegalProjectStateError | OtherError> => {
  switch (template) {
    case 'cre4.v0':
      return makeCre4V0Certificate(data, validateur);
    case 'cre4.v1':
      return makeCre4V1Certificate(data, validateur);
    case 'ppe2.v1':
      return makePpe2V1Certificate(data, validateur);
    case 'ppe2.v2':
      return makePpe2V2Certificate(data, validateur);
  }
};
