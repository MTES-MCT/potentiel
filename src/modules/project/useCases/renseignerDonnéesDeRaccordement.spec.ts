import { UniqueEntityID } from '@core/domain';
import { okAsync } from '@core/utils';
import { InfraNotAvailableError } from '@modules/shared';

import { fakeRepo } from '../../../__tests__/fixtures/aggregates';
import makeFakeProject from '../../../__tests__/fixtures/project';
import { DateMiseEnServicePlusRécenteError, ImpossibleDeChangerLaDateDeFAError } from '../errors';
import { DonnéesDeRaccordementRenseignées } from '../events';
import { Project } from '../Project';
import { makeRenseignerDonnéesDeRaccordement } from './renseignerDonnéesDeRaccordement';

describe('Renseigner des données de raccordement', () => {
  const projetId = new UniqueEntityID().toString();
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null));
  beforeEach(() => publishToEventStore.mockClear());
  const identifiantGestionnaireRéseau = 'id-gestionnaire';

  describe(`Date de mise en service présente`, () => {
    describe(`Impossible de renseigner des données de raccordement avec une date de mise en service plus récente`, () => {
      it(`Étant donné un projet avec une date de mise en service
        Lorsqu'on renseigne des données de raccordement avec une date de mise en service plus récente que celle du projet
        Alors on devrait être averti qu'il n'est pas possible de renseigner des données de raccordement avec une date plus récente
        Et aucun évènement ne devrait être émis`, async () => {
        const projectRepo = fakeRepo({
          ...makeFakeProject(),
          id: projetId,
          dateMiseEnService: new Date('2022-01-01'),
        } as Project);

        const renseignerDonnéesDeRaccordement = makeRenseignerDonnéesDeRaccordement({
          publishToEventStore,
          projectRepo,
        });

        const résultat = await renseignerDonnéesDeRaccordement({
          projetId,
          dateMiseEnService: new Date('2023-01-01'),
          identifiantGestionnaireRéseau,
        });

        expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(DateMiseEnServicePlusRécenteError);
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });

    describe(`Ne pas renseigner des données de raccordement avec une date de mise en service identique`, () => {
      it(`Lorsqu'on renseigne des données de raccordement avec une date de mise en service identique à celle du projet
        Alors aucun évènment ne devrait être émis`, async () => {
        const projectRepo = fakeRepo({
          ...makeFakeProject(),
          id: projetId,
          dateMiseEnService: new Date('2022-01-01'),
        } as Project);

        const renseignerDonnéesDeRaccordement = makeRenseignerDonnéesDeRaccordement({
          publishToEventStore,
          projectRepo,
        });

        const résultat = await renseignerDonnéesDeRaccordement({
          projetId,
          dateMiseEnService: new Date('2022-01-01'),
          identifiantGestionnaireRéseau,
        });

        expect(résultat.isOk()).toBe(true);
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });

    describe(`Renseigner des données de raccordement`, () => {
      it(`Lorsqu'on renseigne des données de raccordement pour un projet avec :
          - une date de mise en service au 01/01/2024
          - et une date en file d'attente au 31/12/2022
        Alors les données de raccordement devrait être renseignées pour le projet
        Et la date de mise en service devrait être 01/01/2024
        Et la date en file d'attente devrait être 31/12/2022`, async () => {
        const dateMiseEnService = new Date('2024-01-01');
        const dateFileAttente = new Date('2022-12-31');

        const projectRepo = fakeRepo({
          ...makeFakeProject(),
          id: projetId,
        } as Project);

        const renseignerDonnéesDeRaccordement = makeRenseignerDonnéesDeRaccordement({
          publishToEventStore,
          projectRepo,
        });

        const résultat = await renseignerDonnéesDeRaccordement({
          projetId,
          dateMiseEnService,
          dateFileAttente,
          identifiantGestionnaireRéseau,
        });

        expect(résultat.isOk()).toBe(true);
        expect(publishToEventStore).toHaveBeenCalledWith(
          expect.objectContaining({
            type: DonnéesDeRaccordementRenseignées.type,
            payload: expect.objectContaining({
              projetId,
              dateMiseEnService,
              dateFileAttente,
            }),
          }),
        );
      });
    });
  });

  describe(`Date d'entrée en file d'attente importée sans date de mise en service`, () => {
    describe(`Impossible de changer seulement la date de FA d'un projet qui a déjà une date de MeS`, () => {
      it(`Etant donné un projet qui a une date de MeS, 
      lorsque la commande est appelée avec une date de FA seulement,
      alors la date de FA importée doit être ignorée`, async () => {
        const projectRepo = fakeRepo({
          ...makeFakeProject(),
          id: projetId,
          dateMiseEnService: new Date('2022-01-01'),
        } as Project);

        const renseignerDonnéesDeRaccordement = makeRenseignerDonnéesDeRaccordement({
          publishToEventStore,
          projectRepo,
        });

        const résultat = await renseignerDonnéesDeRaccordement({
          projetId,
          dateFileAttente: new Date('2023-01-01'),
          identifiantGestionnaireRéseau,
        });

        expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(ImpossibleDeChangerLaDateDeFAError);
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });

    describe(`Ne rien faire si la date de FA importée est identique à la date de FA du projet`, () => {
      it(`Etant donné un projet qui a une date de FA, 
      lorsque la commande est appelée avec une date de FA identique à celle du projet (et pas de MeS),
      alors la date de FA importée doit être ignorée`, async () => {
        const projectRepo = fakeRepo({
          ...makeFakeProject(),
          id: projetId,
          dateFileAttente: new Date('2023-01-01'),
        } as Project);

        const renseignerDonnéesDeRaccordement = makeRenseignerDonnéesDeRaccordement({
          publishToEventStore,
          projectRepo,
        });

        await renseignerDonnéesDeRaccordement({
          projetId,
          dateFileAttente: new Date('2023-01-01'),
          identifiantGestionnaireRéseau,
        });

        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });

    describe(`Possible de renseigner une nouvelle date de FA seule si le projet n'a pas de date de MeS`, () => {
      it(`Etant donné un projet qui n'a pas de date de MeS ni de date de FA, 
      lorsque la commande est appelée avec une date de FA seulement,
      alors la date de FA importée doit ajoutée au projet`, async () => {
        const projectRepo = fakeRepo({
          ...makeFakeProject(),
          id: projetId,
        } as Project);

        const renseignerDonnéesDeRaccordement = makeRenseignerDonnéesDeRaccordement({
          publishToEventStore,
          projectRepo,
        });

        const résultat = await renseignerDonnéesDeRaccordement({
          projetId,
          dateFileAttente: new Date('2023-01-01'),
          identifiantGestionnaireRéseau,
        });

        expect(résultat.isOk()).toBe(true);
        expect(publishToEventStore).toHaveBeenCalledWith(
          expect.objectContaining({
            type: DonnéesDeRaccordementRenseignées.type,
            payload: expect.objectContaining({
              projetId,
              dateFileAttente: new Date('2023-01-01'),
            }),
          }),
        );
      });

      it(`Etant donné un projet qui n'a pas de date de MeS et qui a une date de FA, 
      lorsque la commande est appelée avec une date de FA seulement,
      alors la date de FA importée doit ajoutée au projet à la place de l'ancienne`, async () => {
        const projectRepo = fakeRepo({
          ...makeFakeProject(),
          id: projetId,
          dateFileAttente: new Date('2022-01-01'),
        } as Project);

        const renseignerDonnéesDeRaccordement = makeRenseignerDonnéesDeRaccordement({
          publishToEventStore,
          projectRepo,
        });

        const résultat = await renseignerDonnéesDeRaccordement({
          projetId,
          dateFileAttente: new Date('2023-01-01'),
          identifiantGestionnaireRéseau: 'id',
        });

        expect(résultat.isOk()).toBe(true);
        expect(publishToEventStore).toHaveBeenCalledWith(
          expect.objectContaining({
            type: DonnéesDeRaccordementRenseignées.type,
            payload: expect.objectContaining({
              projetId,
              dateFileAttente: new Date('2023-01-01'),
            }),
          }),
        );
      });
    });
  });
});
