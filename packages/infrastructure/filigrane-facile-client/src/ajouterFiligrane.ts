import { Option } from '@potentiel-libraries/monads';

import { postFile } from './postFile';
import { getFile as getWatermarkedFile } from './getFile';
import { checkFileExists } from './checkFileExists';

export const ajouterFiligrane = async (
  document: Blob,
  filigrane: string,
): Promise<Option.Type<ReadableStream>> => {
  const token = await postFile(filigrane, document);

  const fileExists = await checkFileExists(token);

  if (!fileExists) {
    return Option.none;
  }

  const documentAvecFiligrane = await getWatermarkedFile(token);
  return documentAvecFiligrane;
};
