export const isFonctionnalitéDélaiActivée = () =>
  process.env.FEATURES?.split(',').includes('délai') ?? false;
