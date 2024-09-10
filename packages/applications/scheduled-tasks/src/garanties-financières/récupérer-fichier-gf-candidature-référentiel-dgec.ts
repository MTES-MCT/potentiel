import { readdir } from 'fs/promises';
import path from 'path';

import { IdentifiantProjet } from '@potentiel-domain/common';

if (!process.env.DIRECTORY_PATH) {
  console.error(`La variable d'environnement DIRECTORY_PATH n'est pas définie.`);
  process.exit(1);
}

(async () => {
  try {
    const directoryPath = process.env.DIRECTORY_PATH!;
    const dirrents = await readdir(directoryPath, {
      withFileTypes: true,
    });

    console.log('Contenu du dossier :');
    for (const file of dirrents) {
      if (!file.isFile() || path.extname(file.name).toLowerCase() !== '.pdf') {
        continue;
      }
      const fileName = path.basename(file.name, '.pdf');

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(fileName);

      console.log(identifiantProjet);
      // const identifiantProjet = console.log(file);
    }
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
