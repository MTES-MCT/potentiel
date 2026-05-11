const fetchFeatureFlag = () => {
  const features = process.env.FEATURES?.split(',') ?? [];

  return features;
};

export const featureFlag = fetchFeatureFlag();
