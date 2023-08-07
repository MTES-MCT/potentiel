import { download } from '@potentiel/file-storage';
import { join } from 'path';
import { extension } from 'mime-types';
import { TéléchargerDépôtAttestationGarantiesFinancièresPort } from '@potentiel/domain-views';

// TO DO : adapter unique qui peut prendre plusieurs types
export const téléchargerFichierDépôtAttestationGarantiesFinancièresAdapter: TéléchargerDépôtAttestationGarantiesFinancièresPort =
  async (data) => {
    const { identifiantProjet, type, format } = data;

    const filePath = join(identifiantProjet, `${type}.${extension(format)}`);

    try {
      return await download(filePath);
    } catch (error) {
      return undefined;
    }
  };
