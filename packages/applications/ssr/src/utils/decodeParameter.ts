/**
 *
 * @param parameter Le paramètre à décoder au format URI (Uniform Resource Identifier)
 * @returns un paramètre décodé de type string
 */
export const decodeParameter = (parameter: string) => {
  console.log('😁😁 decodeParameter', { parameter });

  try {
    return decodeURIComponent(parameter);
  } catch (error) {
    console.error('Erreur lors du décodage du paramètre', { parameter, error });
    return parameter;
  }
};
