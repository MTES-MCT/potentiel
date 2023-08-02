import { deleteFile, getFiles, upload } from '@potentiel/file-storage';
import { join } from 'path';
import { extension } from 'mime-types';
import { TéléverserFichierAttestationGarantiesFinancièresPort } from '@potentiel/domain';

export const téléverserFichierAttestationGarantiesFinancièresAdapter: TéléverserFichierAttestationGarantiesFinancièresPort =
  async (data) => {
    const {
      identifiantProjet,
      type,
      attestationConstitution: { content, format },
    } = data;

    await supprimerFichierActuel(identifiantProjet, type);

    const path = join(identifiantProjet, `${data.type}.${extension(format)}`);

    await upload(path, content);
  };

async function supprimerFichierActuel(identifiantProjet: string, type: string) {
  const filePaths = await getFiles(join(identifiantProjet, type));
  if (!filePaths.length) {
    return;
  }

  for (const filePath of filePaths) {
    await deleteFile(filePath);
  }
}
