/**
 *
 * @param parameter
 * @returns le paramètre de l'url encodé, avec les espaces remplacés par des +
 */
export const encodeParameter = (parameter: string) =>
  encodeURIComponent(parameter).replace(/%20/g, '+');
