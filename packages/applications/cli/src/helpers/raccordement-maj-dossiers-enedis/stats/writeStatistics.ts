import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import { Statistics } from './getStatistics';

export const writeStatisticsToFiles = async (statistics: Statistics) => {
  if (statistics.ligneSansRéférenceDossier.length > 0) {
    await writeFile(
      path.resolve(__dirname, '../logs', 'ligneSansRéférenceDossier.json'),
      JSON.stringify(statistics.ligneSansRéférenceDossier, null, 2),
    );
  }
  if (statistics.projetSansRaccordement.length > 0) {
    await writeFile(
      path.resolve(__dirname, '../logs', 'projetSansRaccordement.json'),
      JSON.stringify(statistics.projetSansRaccordement, null, 2),
    );
  }
  if (statistics.plusieursDossiersDeRaccordement.length > 0) {
    await writeFile(
      path.resolve(__dirname, '../logs', 'plusieursDossiersDeRaccordement.json'),
      JSON.stringify(statistics.plusieursDossiersDeRaccordement, null, 2),
    );
  }
  if (statistics.UnSeulDossierDeRaccordement.total > 0) {
    await mkdir(path.resolve(__dirname, '../logs/unSeulDossierDeRaccordement'), {
      recursive: true,
    });

    /**
     * Un seul dossier de raccordement : modifier la référence du dossier de raccordement
     */
    if (
      statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.erreurs.length > 0
    ) {
      await writeFile(
        path.resolve(
          __dirname,
          '../logs/unSeulDossierDeRaccordement',
          'modifierRéférenceDossierRaccordement_erreurs.json',
        ),
        JSON.stringify(
          statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.erreurs,
          null,
          2,
        ),
      );
    }
    if (
      statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.succès.length > 0
    ) {
      await writeFile(
        path.resolve(
          __dirname,
          '../logs/unSeulDossierDeRaccordement',
          'modifierRéférenceDossierRaccordement_succès.json',
        ),
        JSON.stringify(
          statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.succès,
          null,
          2,
        ),
      );
    }
  }

  if (statistics.pasDeDossierDeRaccordement.total > 0) {
    await mkdir(path.resolve(__dirname, '../logs/pasDeDossierDeRaccordement'), { recursive: true });

    /**
     * Pas de dossier de raccordement : transmettre la demande complète de raccordement
     */
    if (
      statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.erreurs
        .length > 0
    ) {
      await writeFile(
        path.resolve(
          __dirname,
          '../logs/pasDeDossierDeRaccordement',
          'transmettreDemandeComplètementRaccordement_erreurs.json',
        ),
        JSON.stringify(
          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.erreurs,
          null,
          2,
        ),
      );
    }
    if (
      statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.succès
        .length > 0
    ) {
      await writeFile(
        path.resolve(
          __dirname,
          '../logs/pasDeDossierDeRaccordement',
          'transmettreDemandeComplètementRaccordement_succès.json',
        ),
        JSON.stringify(
          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.succès,
          null,
          2,
        ),
      );
    }

    /***
     *  Pas de dossier de raccordement -> transmettre la demande complète de raccordement -> tâche renseigner accusé réception DCR
     */
    if (
      statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
        .tâcheRenseignerAccuséRéception.total > 0
    ) {
      if (
        statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
          .tâcheRenseignerAccuséRéception.erreurs.length > 0
      ) {
        await writeFile(
          path.resolve(
            __dirname,
            '../logs/pasDeDossierDeRaccordement',
            'tâcheRenseignerAccuséRéception_erreurs.json',
          ),
          JSON.stringify(
            statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
              .tâcheRenseignerAccuséRéception.erreurs,
            null,
            2,
          ),
        );
      }
      if (
        statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
          .tâcheRenseignerAccuséRéception.succès.length > 0
      ) {
        await writeFile(
          path.resolve(
            __dirname,
            '../logs/pasDeDossierDeRaccordement',
            'tâcheRenseignerAccuséRéception_succès.json',
          ),
          JSON.stringify(
            statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
              .tâcheRenseignerAccuséRéception.succès,
            null,
            2,
          ),
        );
      }
    }
  }
};
