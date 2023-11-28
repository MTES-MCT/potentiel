/**
 *
 * @param parameter Le paramètre à encoder de type string
 * @returns un paramètre encodé en respecant le format URI (Uniform Resource Identifier)
 */
export const encodeParameter = (parameter: string) => encodeURIComponent(parameter);
