import { FiligraneFacileClient } from '@potentiel-infrastructure/filigrane-facile-client';
import { Option } from '@potentiel-libraries/monads';

export const applyWatermark = async (originalBlob: Blob) => {
  if (originalBlob.size === 0) {
    return originalBlob;
  }
  const watermarkedBlob = await FiligraneFacileClient.ajouterFiligrane(
    originalBlob,
    'potentiel.beta.gouv.fr',
  );
  return Option.match(watermarkedBlob)
    .some((watermarkedBlob) => watermarkedBlob)
    .none(() => originalBlob);
};
