import { Option } from '@potentiel-libraries/monads';
// import { getLogger } from '@potentiel-libraries/monitoring';

import { startApplyingWatermarkOnFile } from './startApplyingWatermarkOnFile';
import { getWatermarkedFile } from './getWatermarkedFile';
import { isWatermarkedFileAvailable } from './isWatermarkedFileAvailable';

export const ajouterFiligrane = async (
  document: Blob,
  filigrane: string,
): Promise<Option.Type<Blob>> => {
  try {
    const token = await startApplyingWatermarkOnFile(document, filigrane);

    const fileExists = await isWatermarkedFileAvailable(token);

    if (!fileExists) {
      return Option.none;
    }

    const documentAvecFiligrane = await getWatermarkedFile(token);

    return documentAvecFiligrane;
  } catch {
    /**
     * @todo À investiguer parce qu'aujourd'hui ça casse le build SSR
     */
    // getLogger().warn(
    //   `Erreur lors de l'ajout du filigrane | Le document a été transmis sans filigrane`,
    //   {
    //     error,
    //     filigrane,
    //   },
    // );
    return Option.none;
  }
};
