import { getLogger } from '@potentiel-libraries/monitoring';

type FetchFeature = () => Array<string>;

export const fetchFeatures: FetchFeature = () => {
  const features = process.env.FEATURES?.split(',') ?? [];
  getLogger().info(`Activated features : ${features.join(', ')}`);

  return features;
};
