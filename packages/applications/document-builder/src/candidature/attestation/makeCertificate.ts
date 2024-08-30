import { AppelOffre } from '@potentiel-domain/appel-offre';

import { makeCertificate as makeCre4V0Certificate } from './cre4/v0/makeCertificate';
import { makeCertificate as makeCre4V1Certificate } from './cre4/v1/makeCertificate';
import { makeCertificate as makePpe2V1Certificate } from './ppe2/v1/makeCertificate';
import { makeCertificate as makePpe2V2Certificate } from './ppe2/v2/makeCertificate';
import { AttestationCandidatureOptions } from './AttestationCandidatureOptions';

export const makeCertificate = ({
  data,
  imagesFolderPath,
  template,
  validateur,
}: {
  template: AppelOffre.CertificateTemplate;
  data: AttestationCandidatureOptions;
  validateur: AppelOffre.Validateur;
  imagesFolderPath: string;
}) => {
  switch (template) {
    case 'cre4.v0':
      return makeCre4V0Certificate(data, validateur, imagesFolderPath);
    case 'cre4.v1':
      return makeCre4V1Certificate(data, validateur, imagesFolderPath);
    case 'ppe2.v1':
      return makePpe2V1Certificate(data, validateur, imagesFolderPath);
    case 'ppe2.v2':
      return makePpe2V2Certificate(data, validateur, imagesFolderPath);
  }
};
