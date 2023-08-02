import { download } from '@potentiel/file-storage';
import { join } from 'path';
import { extension } from 'mime-types';
import { TéléchargerAttestationGarantiesFinancièresPort } from '@potentiel/domain-views';

export const téléchargerFichierAttestationGarantiesFinancièresAdapter: TéléchargerAttestationGarantiesFinancièresPort =
  async (data) => {
    const { identifiantProjet, type, format } = data;

    const filePath = join(identifiantProjet, `${type}.${extension(format)}`);

    try {
      return await download(filePath);
    } catch (error) {
      return undefined;
    }
  };
