/**
 *
 * @param parameter Le paramètre à décoder au format URI (Uniform Resource Identifier)
 * @returns un paramètre décodé de type string
 */
export const decodeParameter = (parameter: string) => decodeURIComponent(parameter);
