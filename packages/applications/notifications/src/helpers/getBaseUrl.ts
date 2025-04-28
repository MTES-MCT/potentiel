export const getBaseUrl = () => {
  const { BASE_URL: baseUrl } = process.env;

  if (!baseUrl) {
    throw new Error(`variable d'environnement BASE_URL non trouvée`);
  }
  return baseUrl;
};
