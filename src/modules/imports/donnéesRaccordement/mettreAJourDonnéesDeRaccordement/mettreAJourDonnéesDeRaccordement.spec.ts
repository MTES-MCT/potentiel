import { errAsync, okAsync } from '@core/utils';
import { DateMiseEnServicePlusRécenteError } from '@modules/project';
import { makeMettreAJourDonnéesDeRaccordement } from './mettreAJourDonnéesDeRaccordement';

describe(`Mettre à jour les dates de mise en service`, () => {
  const publishToEventStore = jest.fn(() => okAsync(null));
  const renseignerDonnéesDeRaccordement = jest.fn(() => okAsync(null));

  beforeEach(() => {
    publishToEventStore.mockClear();
    renseignerDonnéesDeRaccordement.mockClear();
  });

  describe(`Mise à jour des données de raccordement des projets`, () => {
    it(`Étant donné un unique projet par identifiant gestionnaire réseau
        Lorsqu'un évènement 'TâcheMiseAJourDonnéesDeRaccordementDémarrée' survient
        Alors les données de raccordement des projets correspondant devrait être renseignées
        Et la tâche devrait être terminée avec le résultat des mises à jour`, async () => {
      const mettreAJourDonnéesDeRaccordement = makeMettreAJourDonnéesDeRaccordement({
        getProjetsParIdentifiantGestionnaireRéseau: () =>
          okAsync({
            'NUM-GEST-1': [
              {
                projetId: 'projet-1',
              },
            ],
            'NUM-GEST-2': [
              {
                projetId: 'projet-2',
              },
            ],
          }),
        renseignerDonnéesDeRaccordement,
        publishToEventStore,
      });

      const miseAJour = await mettreAJourDonnéesDeRaccordement({
        gestionnaire: 'Enedis',
        données: [
          {
            identifiantGestionnaireRéseau: 'NUM-GEST-1',
            dateMiseEnService: new Date('2024-01-20'),
            dateFileAttente: new Date('2023-01-20'),
          },
          {
            identifiantGestionnaireRéseau: 'NUM-GEST-2',
            dateMiseEnService: new Date('2024-02-20'),
          },
        ],
      });

      expect(miseAJour.isOk()).toBe(true);

      expect(renseignerDonnéesDeRaccordement).toHaveBeenCalledTimes(2);
      expect(renseignerDonnéesDeRaccordement).toHaveBeenCalledWith({
        projetId: 'projet-1',
        dateMiseEnService: new Date('2024-01-20'),
        dateFileAttente: new Date('2023-01-20'),
        identifiantGestionnaireRéseau: 'NUM-GEST-1',
      });
      expect(renseignerDonnéesDeRaccordement).toHaveBeenCalledWith({
        projetId: 'projet-2',
        dateMiseEnService: new Date('2024-02-20'),
        identifiantGestionnaireRéseau: 'NUM-GEST-2',
      });

      expect(publishToEventStore).toHaveBeenLastCalledWith(
        expect.objectContaining({
          aggregateId: 'import-données-raccordement#Enedis',
          type: 'TâcheMiseAJourDonnéesDeRaccordementTerminée',
          payload: expect.objectContaining({
            gestionnaire: 'Enedis',
            résultat: [
              {
                identifiantGestionnaireRéseau: 'NUM-GEST-1',
                projetId: 'projet-1',
                état: 'succès',
              },
              {
                identifiantGestionnaireRéseau: 'NUM-GEST-2',
                projetId: 'projet-2',
                état: 'succès',
              },
            ],
          }),
        }),
      );
    });
  });

  describe(`Ne pas mettre à jour si plusieurs résultats pour un identifiant`, () => {
    it(`Étant donné plusieurs projets avec l'identifiant gestionnaire de réseau 'Enedis'
        Et le projet 'Projet Test' avec l'identifiant 'AAA-BB-2022-000001'
        Lorsqu'un évènement 'TâcheMiseAJourDonnéesDeRaccordementDémarrée' survient
        Alors les données de raccordement devrait être renseignée seulement pour le projet 'Projet Test'
        Et la tâche devrait être terminée
        Et le résultat devrait être un 'succès' pour l'identifiant 'AAA-BB-2022-000001'
        Et devrait être en 'échec' pour 'Enedis' avec la raison 'Plusieurs projets correspondent à l'identifiant'`, async () => {
      const mettreAJourDonnéesDeRaccordement = makeMettreAJourDonnéesDeRaccordement({
        getProjetsParIdentifiantGestionnaireRéseau: () =>
          okAsync({
            Enedis: [
              {
                projetId: 'projet-1',
              },
              {
                projetId: 'projet-2',
              },
            ],
            'AAA-BB-2022-000001': [
              {
                projetId: 'Projet Test',
              },
            ],
          }),
        renseignerDonnéesDeRaccordement,
        publishToEventStore,
      });

      const miseAJour = await mettreAJourDonnéesDeRaccordement({
        gestionnaire: 'Enedis',
        données: [
          {
            identifiantGestionnaireRéseau: 'Enedis',
            dateMiseEnService: new Date('2024-01-20'),
          },
          {
            identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
            dateMiseEnService: new Date('2024-02-20'),
          },
        ],
      });

      expect(miseAJour.isOk()).toBe(true);

      expect(renseignerDonnéesDeRaccordement).toHaveBeenCalledTimes(1);
      expect(renseignerDonnéesDeRaccordement).toHaveBeenCalledWith({
        projetId: 'Projet Test',
        dateMiseEnService: new Date('2024-02-20'),
        identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
      });
      expect(renseignerDonnéesDeRaccordement).not.toHaveBeenCalledWith(
        expect.objectContaining({
          dateMiseEnService: new Date('2024-01-20'),
          identifiantGestionnaireRéseau: 'Enedis',
        }),
      );

      expect(publishToEventStore).toHaveBeenLastCalledWith(
        expect.objectContaining({
          aggregateId: 'import-données-raccordement#Enedis',
          type: 'TâcheMiseAJourDonnéesDeRaccordementTerminée',
          payload: expect.objectContaining({
            gestionnaire: 'Enedis',
            résultat: expect.arrayContaining([
              {
                identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
                projetId: 'Projet Test',
                état: 'succès',
              },
              {
                identifiantGestionnaireRéseau: 'Enedis',
                état: 'échec',
                raison: `Plusieurs projets correspondent à l'identifiant gestionnaire de réseau`,
              },
            ]),
          }),
        }),
      );
    });
  });

  describe(`Ne pas mettre à jour si aucun résultat pour un identifiant`, () => {
    it(`Étant donné aucun projet avec l'identifiant gestionnaire de réseau 'Enedis'
        Et le projet 'Projet Test' avec l'identifiant 'AAA-BB-2022-000001'
        Lorsqu'un évènement 'TâcheMiseAJourDatesEnServiceDémarrée' survient
        Alors les données de raccordement devrait être renseignée seulement pour le projet 'Projet Test'
        Et la tâche devrait être terminée
        Et le résultat devrait être un 'succès' pour l'identifiant 'AAA-BB-2022-000001'
        Et devrait être en 'échec' pour 'Enedis' avec la raison 'Aucun projet ne correspond à l'identifiant'`, async () => {
      const mettreAJourDonnéesDeRaccordement = makeMettreAJourDonnéesDeRaccordement({
        getProjetsParIdentifiantGestionnaireRéseau: () =>
          okAsync({
            Enedis: [],
            'AAA-BB-2022-000001': [
              {
                projetId: 'Projet Test',
              },
            ],
          }),
        renseignerDonnéesDeRaccordement,
        publishToEventStore,
      });

      const miseAJour = await mettreAJourDonnéesDeRaccordement({
        gestionnaire: 'Enedis',
        données: [
          {
            identifiantGestionnaireRéseau: 'Enedis',
            dateMiseEnService: new Date('2024-01-20'),
          },
          {
            identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
            dateMiseEnService: new Date('2024-02-20'),
          },
        ],
      });

      expect(miseAJour.isOk()).toBe(true);

      expect(renseignerDonnéesDeRaccordement).toHaveBeenCalledTimes(1);
      expect(renseignerDonnéesDeRaccordement).toHaveBeenCalledWith({
        projetId: 'Projet Test',
        dateMiseEnService: new Date('2024-02-20'),
        identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
      });
      expect(renseignerDonnéesDeRaccordement).not.toHaveBeenCalledWith(
        expect.objectContaining({
          dateMiseEnService: new Date('2024-01-20'),
          identifiantGestionnaireRéseau: 'Enedis',
        }),
      );

      expect(publishToEventStore).toHaveBeenLastCalledWith(
        expect.objectContaining({
          aggregateId: 'import-données-raccordement#Enedis',
          type: 'TâcheMiseAJourDonnéesDeRaccordementTerminée',
          payload: expect.objectContaining({
            gestionnaire: 'Enedis',
            résultat: expect.arrayContaining([
              {
                identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
                projetId: 'Projet Test',
                état: 'succès',
              },
              {
                identifiantGestionnaireRéseau: 'Enedis',
                état: 'échec',
                raison: `Aucun projet ne correspond à l'identifiant gestionnaire de réseau`,
              },
            ]),
          }),
        }),
      );
    });
  });

  describe(`Avoir un résultat en 'échec' si la mise à jour échoue`, () => {
    it(`Lorsqu'un évènement 'TâcheMiseAJourDonnéesDeRaccordementDémarrée' survient avec un seul identifiant
        Et que la mise à jour de les données de raccordement du projet échoue
        Alors les données de raccordement ne devrait pas être renseignée pour le projet
        Et la tâche devrait être terminée
        Et le résultat devrait être en 'échec' avec la raison de l'erreur`, async () => {
      const mettreAJourDonnéesDeRaccordement = makeMettreAJourDonnéesDeRaccordement({
        getProjetsParIdentifiantGestionnaireRéseau: () =>
          okAsync({
            'AAA-BB-2022-000001': [
              {
                projetId: 'Projet Test',
              },
            ],
          }),
        renseignerDonnéesDeRaccordement: () => errAsync(new Error(`Il y a eu une erreur`)),
        publishToEventStore,
      });

      const miseAJour = await mettreAJourDonnéesDeRaccordement({
        gestionnaire: 'Enedis',
        données: [
          {
            identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
            dateMiseEnService: new Date('2024-02-20'),
          },
        ],
      });

      expect(miseAJour.isOk()).toBe(true);

      expect(publishToEventStore).toHaveBeenLastCalledWith(
        expect.objectContaining({
          aggregateId: 'import-données-raccordement#Enedis',
          type: 'TâcheMiseAJourDonnéesDeRaccordementTerminée',
          payload: expect.objectContaining({
            gestionnaire: 'Enedis',
            résultat: expect.arrayContaining([
              {
                identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
                projetId: 'Projet Test',
                état: 'échec',
                raison: `Il y a eu une erreur`,
              },
            ]),
          }),
        }),
      );
    });
  });

  describe(`Avoir un résultat 'ignoré' si la date était plus récente`, () => {
    it(`Lorsqu'un évènement 'TâcheMiseAJourDonnéesDeRaccordementDémarrée' survient avec un seul identifiant
        Et que la mise à jour de les données de raccordement du projet échoue car 'La date est plus récente que l'actuelle'
        Alors les données de raccordement ne devrait pas être renseignée pour le projet
        Et la tâche devrait être terminée
        Et le résultat devrait être 'ignoré' avec la raison`, async () => {
      const erreur = new DateMiseEnServicePlusRécenteError();

      const mettreAJourDonnéesDeRaccordement = makeMettreAJourDonnéesDeRaccordement({
        getProjetsParIdentifiantGestionnaireRéseau: () =>
          okAsync({
            'AAA-BB-2022-000001': [
              {
                projetId: 'Projet Test',
              },
            ],
          }),
        renseignerDonnéesDeRaccordement: () => errAsync(erreur),
        publishToEventStore,
      });

      const miseAJour = await mettreAJourDonnéesDeRaccordement({
        gestionnaire: 'Enedis',
        données: [
          {
            identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
            dateMiseEnService: new Date('2024-02-20'),
          },
        ],
      });

      expect(miseAJour.isOk()).toBe(true);

      expect(publishToEventStore).toHaveBeenLastCalledWith(
        expect.objectContaining({
          aggregateId: 'import-données-raccordement#Enedis',
          type: 'TâcheMiseAJourDonnéesDeRaccordementTerminée',
          payload: expect.objectContaining({
            gestionnaire: 'Enedis',
            résultat: expect.arrayContaining([
              {
                identifiantGestionnaireRéseau: 'AAA-BB-2022-000001',
                projetId: 'Projet Test',
                état: 'ignoré',
                raison: erreur.message,
              },
            ]),
          }),
        }),
      );
    });
  });
});
