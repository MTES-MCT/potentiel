import { Option } from '@potentiel-libraries/monads';

import { startApplyingWatermarkOnFile } from './startApplyingWatermarkOnFile';
import { getWatermarkedFile } from './getWatermarkedFile';
import { isWatermarkedFileAvailable } from './isWatermarkedFileAvailable';

export const ajouterFiligrane = async (
  document: Blob,
  filigrane: string,
): Promise<Option.Type<Blob>> => {
  const token = await startApplyingWatermarkOnFile(document, filigrane);

  const fileExists = await isWatermarkedFileAvailable(token);

  if (!fileExists) {
    return Option.none;
  }

  const documentAvecFiligrane = await getWatermarkedFile(token);

  return documentAvecFiligrane;
};
