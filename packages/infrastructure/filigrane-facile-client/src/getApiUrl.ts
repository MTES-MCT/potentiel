class FiligraneFacileClientCOnfigurationError extends Error {
  constructor() {
    super(`Configuration is missing for the FiligraneFacileClient`);
  }
}

export const getApiUrl = () => {
  if (!process.env.FILIGRANE_FACILE_ENDPOINT) {
    throw new FiligraneFacileClientCOnfigurationError();
  }

  return process.env.FILIGRANE_FACILE_ENDPOINT;
};
