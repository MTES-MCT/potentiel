export type Statistics = {
  total: number;
  ligneSansRéférenceDossier: Array<string>;
  projetSansRaccordement: Array<string>;
  plusieursDossiersDeRaccordement: Array<{
    identifiantProjet: string;
    référenceFichier: string;
    référencesActuelles: string[];
  }>;
  UnSeulDossierDeRaccordement: {
    total: number;
    modifierRéférenceDossierRaccordement: {
      total: number;
      succès: Array<{
        identifiantProjet: string;
        référenceDossier: string;
      }>;
      erreurs: Array<{
        identifiantProjet: string;
        référenceDossier: string;
        erreur: string;
      }>;
    };
    modifierDemandeComplètementRaccordement: {
      total: number;
      sansAccuséRéception: {
        total: number;
        succès: Array<{
          identifiantProjet: string;
          dateQualification: string;
        }>;
        erreurs: Array<{
          identifiantProjet: string;
          dateQualification: string;
          erreur: string;
        }>;
      };
      avecAccuséRéception: {
        total: number;
        succès: Array<{
          identifiantProjet: string;
          dateQualification: string;
        }>;
        erreurs: Array<{
          identifiantProjet: string;
          dateQualification: string;
          erreur: string;
        }>;
      };
    };
  };
  pasDeDossierDeRaccordement: {
    total: number;
    transmettreDemandeComplètementRaccordement: {
      total: number;
      succès: Array<{
        identifiantProjet: string;
        référenceDossier: string;
      }>;
      erreurs: Array<{
        identifiantProjet: string;
        référenceDossier: string;
        erreur: string;
      }>;
      tâcheRenseignerAccuséRéception: {
        total: number;
        succès: Array<{
          identifiantProjet: string;
          référenceDossier: string;
        }>;
        erreurs: Array<{
          identifiantProjet: string;
          référenceDossier: string;
          erreur: string;
        }>;
      };
    };
  };
};

export const getStatistics = (total: number) => {
  const statistics: Statistics = {
    total,
    ligneSansRéférenceDossier: [],
    projetSansRaccordement: [],
    plusieursDossiersDeRaccordement: [],
    UnSeulDossierDeRaccordement: {
      total: 0,
      modifierRéférenceDossierRaccordement: {
        total: 0,
        succès: [],
        erreurs: [],
      },
      modifierDemandeComplètementRaccordement: {
        total: 0,
        sansAccuséRéception: {
          total: 0,
          succès: [],
          erreurs: [],
        },
        avecAccuséRéception: {
          total: 0,

          succès: [],
          erreurs: [],
        },
      },
    },
    pasDeDossierDeRaccordement: {
      total: 0,
      transmettreDemandeComplètementRaccordement: {
        total: 0,
        succès: [],
        erreurs: [],
        tâcheRenseignerAccuséRéception: {
          total: 0,
          succès: [],
          erreurs: [],
        },
      },
    },
  };

  return statistics;
};
