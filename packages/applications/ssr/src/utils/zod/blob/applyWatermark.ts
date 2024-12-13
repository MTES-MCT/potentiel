import { Option } from '@potentiel-libraries/monads';
import { FiligraneFacileClient } from '@potentiel-infrastructure/filigrane-facile-client';

export const applyWatermark = async (originalBlob: Blob): Promise<Blob> => {
  const watermarkedBlob = await FiligraneFacileClient.ajouterFiligrane(
    originalBlob,
    'potentiel.beta.gouv.fr',
  );

  return Option.match(watermarkedBlob)
    .some((watermarkedBlob) => watermarkedBlob)
    .none(() => originalBlob);
};
