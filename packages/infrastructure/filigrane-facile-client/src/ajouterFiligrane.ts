import { Option } from '@potentiel-libraries/monads';

import { startApplyingWatermarkOnFile } from './startApplyingWatermarkOnFile';
import { getWatermarkedFile } from './getWatermarkedFile';
import { isWatermarkedFileAvailable } from './isWatermarkedFileAvailable';

export const ajouterFiligrane = async (
  document: Blob,
  filigrane: string,
): Promise<Option.Type<ReadableStream>> => {
  const token = await startApplyingWatermarkOnFile(filigrane, document);

  const fileExists = await isWatermarkedFileAvailable(token);

  if (!fileExists) {
    return Option.none;
  }

  const documentAvecFiligrane = await getWatermarkedFile(token);

  return documentAvecFiligrane.stream();
};
