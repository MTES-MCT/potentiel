/**
 * @description Cette fonction permet de tenter de récupérer une ressource, et de retourner null en cas d'erreur plutôt que de lever une exception
 * @param callback La fonction à appeler pour récupérer la ressource
 * @returns La ressource récupérée, ou null en cas d'erreur
 */
export async function tryToGetResource<TRessource>(
  callback: () => Promise<TRessource>,
): Promise<TRessource | null> {
  try {
    return await callback();
  } catch (error) {
    return null;
  }
}
