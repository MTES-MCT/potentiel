export const isFonctionnalitéDélaiActivée = () =>
  process.env.FEATURES?.split(',').includes('délai') ?? false;

export class FonctionnalitéDélaiIndisponibleError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
