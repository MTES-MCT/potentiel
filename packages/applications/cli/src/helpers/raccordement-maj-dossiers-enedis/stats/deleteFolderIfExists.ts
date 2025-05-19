import { access, constants, rm } from 'fs/promises';

export const deleteFolderIfExists = async (folderPath: string) => {
  try {
    // Vérifie si le dossier existe
    await access(folderPath, constants.F_OK);

    // Supprime le dossier et son contenu
    await rm(folderPath, { recursive: true, force: true });
    console.log(`Dossier supprimé : ${folderPath}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du dossier : ${error}`);
  }
};
