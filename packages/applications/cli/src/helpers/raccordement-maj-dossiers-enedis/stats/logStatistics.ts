import { Statistics } from './getStatistics';

export const logStatistics = (stats: Statistics) => {
  console.log('===== Log Final des Statistiques =====');

  // Afficher les statistiques globales
  console.log(`Total: ${stats.total}`);
  console.log(`Ligne Sans Référence Dossier: ${stats.ligneSansRéférenceDossier.length}`);
  console.log(`Projet Sans Raccordement: ${stats.projetSansRaccordement.length}`);
  console.log(
    `Nombre de Projets avec Plusieurs Dossiers de Raccordement: ${stats.plusieursDossiersDeRaccordement.length}`,
  );

  // UnSeulDossierDeRaccordement
  const unSeulDossier = stats.UnSeulDossierDeRaccordement;
  console.log(`Un Seul Dossier de Raccordement - Total: ${unSeulDossier.total}`);
  console.log(
    `  Modifier Référence Dossier Raccordement - Total: ${unSeulDossier.modifierRéférenceDossierRaccordement.total}`,
  );
  console.log(`    Succès: ${unSeulDossier.modifierRéférenceDossierRaccordement.succès.length}`);
  console.log(`    Erreurs: ${unSeulDossier.modifierRéférenceDossierRaccordement.erreurs.length}`);

  console.log(
    `  Modifier Demande Complètement Raccordement - Total: ${unSeulDossier.modifierDemandeComplètementRaccordement.total}`,
  );
  console.log(
    `     Sans accusé de réception : ${unSeulDossier.modifierDemandeComplètementRaccordement.sansAccuséRéception.total}`,
  );
  console.log(
    `         Succès : ${unSeulDossier.modifierDemandeComplètementRaccordement.sansAccuséRéception.succès.length}`,
  );
  console.log(
    `         Erreurs : ${unSeulDossier.modifierDemandeComplètementRaccordement.sansAccuséRéception.erreurs.length}`,
  );
  console.log(
    `     Avec accusé de réception : ${unSeulDossier.modifierDemandeComplètementRaccordement.avecAccuséRéception.total}`,
  );
  console.log(
    `         Succès : ${unSeulDossier.modifierDemandeComplètementRaccordement.avecAccuséRéception.succès.length}`,
  );
  console.log(
    `         Erreurs : ${unSeulDossier.modifierDemandeComplètementRaccordement.avecAccuséRéception.erreurs.length}`,
  );

  // Pas de Dossier de Raccordement
  const pasDeDossier = stats.pasDeDossierDeRaccordement;
  console.log(`Pas de Dossier de Raccordement - Total: ${pasDeDossier.total}`);

  console.log(
    `  Transmettre Demande Complètement Raccordement - Total: ${pasDeDossier.transmettreDemandeComplètementRaccordement.total}`,
  );
  console.log(
    `    Succès: ${pasDeDossier.transmettreDemandeComplètementRaccordement.succès.length}`,
  );
  console.log(
    `    Erreurs: ${pasDeDossier.transmettreDemandeComplètementRaccordement.erreurs.length}`,
  );
  console.log(
    `  Tâche renseigner accusé réception DCR - Total: ${pasDeDossier.transmettreDemandeComplètementRaccordement.tâcheRenseignerAccuséRéception.total}`,
  );
  console.log(
    `    Succès: ${pasDeDossier.transmettreDemandeComplètementRaccordement.tâcheRenseignerAccuséRéception.succès.length}`,
  );
  console.log(
    `    Erreurs: ${pasDeDossier.transmettreDemandeComplètementRaccordement.tâcheRenseignerAccuséRéception.erreurs.length}`,
  );

  // Résumé final
  console.log('===== Fin des Statistiques =====');
};
