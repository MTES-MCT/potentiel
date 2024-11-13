export const verifyEnvVariables = (envVariables: Array<string>) =>
  envVariables.forEach((varName) => {
    if (!process.env[varName]) {
      console.error(`La variable d'environnement ${varName} n'est pas définie.`);
      process.exit(1);
    }
  });
